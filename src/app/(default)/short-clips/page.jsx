import React from "react";
import { Film } from "lucide-react";
import prisma from "@/lib/prisma";
import Pagination from "@/components/pagination";

// Reusing helper functions
const extractYoutubeId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : null;
};

const fetchYouTubeMeta = async (youtubeId) => {
  if (!youtubeId) return null;
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  let viewCount = null;
  let publishedAt = null;

  // Try API first
  if (youtubeApiKey && youtubeApiKey !== "your_api_key_here") {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${youtubeId}&key=${youtubeApiKey}`,
        { next: { revalidate: 3600 } }
      );
      const data = await res.json();
      const item = data.items?.[0];
      if (item) {
        viewCount = item.statistics?.viewCount
          ? parseInt(item.statistics.viewCount)
          : null;
        publishedAt = item.snippet?.publishedAt;
        return { viewCount, publishedAt };
      }
    } catch (error) {
      console.error(`Error fetching YouTube API for ${youtubeId}:`, error);
    }
  }

  // Fallback: Scrape if API failed
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${youtubeId}`, {
      next: { revalidate: 3600 },
    });
    const html = await res.text();

    // Scrape views
    const viewMatch = html.match(/"viewCount":"(\d+)"/);
    if (viewMatch) {
      viewCount = parseInt(viewMatch[1]);
    } else {
      const labelMatch = html.match(/"label":"([\d,]+) views"/);
      if (labelMatch) viewCount = parseInt(labelMatch[1].replace(/,/g, ""));
      else {
        const interactionMatch = html.match(/"interactionCount":"(\d+)"/);
        if (interactionMatch) viewCount = parseInt(interactionMatch[1]);
      }
    }

    // Scrape date
    const dateMatch = html.match(/"uploadDate":"([^"]+)"/);
    if (dateMatch) {
      publishedAt = dateMatch[1];
    } else {
      const publishedMatch = html.match(/"publishDate":"([^"]+)"/);
      if (publishedMatch) publishedAt = publishedMatch[1];
    }
  } catch (error) {
    console.error(`Error scraping YouTube for ${youtubeId}:`, error);
  }

  return { viewCount, publishedAt };
};

export default async function ShortClipsPage({ searchParams }) {
  const sp = await searchParams;
  const page = Number(sp?.page) || 1;
  const limit = 9;
  const skip = (page - 1) * limit;

  const [clips, total] = await Promise.all([
    prisma.shortClip.findMany({
      orderBy: { order: "desc" },
      skip,
      take: limit,
    }),
    prisma.shortClip.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  const clipsWithMeta = await Promise.all(
    clips.map(async (clip) => {
      const youtubeId = clip.youtubeId || extractYoutubeId(clip.youtubeUrl);
      const meta = await fetchYouTubeMeta(youtubeId);
      // If it's a YouTube video, use fetched views, otherwise use DB views
      const displayViews = youtubeId ? (meta?.viewCount || 0) : clip.viewCount;
      // If it's a YouTube video, use fetched date, otherwise use updatedAt (or createdAt)
      const displayDate = youtubeId ? meta?.publishedAt : clip.updatedAt;

      return {
        ...clip,
        youtubeId,
        viewCount: displayViews,
        publishedAt: displayDate
      };
    })
  );

  return (
    <div className="space-y-8 py-12">
      <div className="text-center flex flex-col items-center mt-8">
        <h2 className="text-[#3F458D] text-4xl font-bold uppercase">Short Clips</h2>
        <div className=" rounded bg-[#F06FAA] w-24 h-1 mt-8"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {clipsWithMeta.map((item, i) => (
          <a
            href={item.youtubeUrl || item.videoUrl || "#"}
            key={i}
            target={item.youtubeUrl ? "_blank" : "_self"}
            rel="noreferrer"
            className="group"
          >
            <div className="card bg-base-100 border shadow-sm hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
              <figure className="relative aspect-[9/16] overflow-hidden bg-black/10">
                <img
                  src={
                    item.thumbnailUrl ||
                    (item.youtubeId
                      ? `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`
                      : "")
                  }
                  alt={item.titleTh}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                    <Film className="w-8 h-8 text-white" />
                  </div>
                </div>
              </figure>

              <div className="card-body p-5">
                <h2 className="card-title text-lg font-bold leading-tight group-hover:text-[#3F458D] transition-colors mb-2 line-clamp-2">
                  {item.titleTh}
                </h2>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-[#99A1AF] group-hover:text-[#3F458D] transition-colors">
                  <div className="flex gap-2 items-center text-sm font-medium">
                    <Film className="h-4 w-4" />
                    <span>{(item.viewCount || 0).toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
        {clipsWithMeta.length === 0 && (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            ยังไม่มีข้อมูล Short Clips ในขณะนี้
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <Pagination page={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
