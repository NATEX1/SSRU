import Pagination from "@/components/pagination";
import prisma from "@/lib/prisma";
import { Film } from "lucide-react";
import React from "react";

export default async function page({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;

  const limit = 9;
  const skip = (page - 1) * limit;

  const [clips, total] = await Promise.all([
    prisma.shortClip.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.shortClip.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="py-8 px-4 space-y-8">
      <div className="text-center flex flex-col items-center gap-2 mt-8">
        <h2 className="text-[#3F458D] text-4xl font-extrabold">Short Clips</h2>

        <div className=" rounded bg-[#F06FAA] w-24 h-1 mt-8"></div>
      </div>

      <div className="grid grid-cols-3 max-w-5xl mx-auto gap-3">
        {clips.map((c) => (
          <a
            key={c.id}
            // href={c.youtubeUrl || c.videoUrl || "#"}
            href={`/short-clips/${c.id}`}
            rel="noreferrer"
            className="block h-full"
          >
            <div className="card border shadow">
              <figure className="h-[348px]">
                <img
                  src={
                    c.thumbnailUrl ||
                    (c.youtubeId
                      ? `https://i.ytimg.com/vi/${c.youtubeId}/hqdefault.jpg`
                      : "/placeholder.jpg")
                  }
                  alt={c.titleTh}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </figure>

              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold line-clamp-2">{c.titleTh}</h3>

                <div className="flex gap-1 items-center text-[#99A1AF] text-sm">
                  <Film className="h-4" />
                  <span>• {c.viewCount.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}
