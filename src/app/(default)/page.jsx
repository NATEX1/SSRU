import ArticleSlider from "@/components/article-slider";
import ClipCarousel from "@/components/home/clip-carousel";
import VlogCarousel from "@/components/home/vlog-clip";
import CommentForm from "@/components/home/comment-form";
import MagazineCarousel from "@/components/home/magazine-carousel";
import { getOnePostEachOtherCategory, getCategoryName } from "@/lib/markdown";
import prisma from "@/lib/prisma";
import { ArrowRight, Calendar, Eye, Share2 } from "lucide-react";

async function getCategoriesWithOneArticle() {
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
    include: {
      articles: {
        where: {
          status: "approved",
          publishedAt: { lte: new Date() },
        },
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          author: { select: { name: true } },
        },
      },
    },
  });

  // แปลง articles array ให้เป็น object เดียว (article)
  return categories.map((category) => ({
    ...category,
    article: category.articles[0] || null, // เอาอันแรก ถ้าไม่มีให้เป็น null
    articles: undefined, // ลบ array เดิม
  }));
}

export default async function Home() {
  const cats = await getCategoriesWithOneArticle();

  const popularArticles = await prisma.article.findMany({
    where: {
      status: "approved",
      publishedAt: { lte: new Date() },
    },
    orderBy: {
      viewCount: "desc",
    },
    take: 7,
  });

  const shortClips = await prisma.shortClip.findMany({
    orderBy: [{ order: "desc" }, { createdAt: "desc" }],
    take: 4,
  });

  const ssruAround = await prisma.ssruAround.findMany({
    orderBy: [{ order: "desc" }, { createdAt: "desc" }],
    take: 2,
  });

  const vlogs = await prisma.vlog.findMany({
    orderBy: [{ order: "desc" }, { createdAt: "desc" }],
    take: 2,
  });

  // Fetch Page content
  const editorPage = await prisma.page.findUnique({ where: { slug: "editor-message" } });
  const criteriaPage = await prisma.page.findUnique({ where: { slug: "submission-criteria" } });

  const youtubeApiKey = process.env.YOUTUBE_API_KEY;

  // Helper to safely get multilingual content with fallback
  const getLang = (obj, field, lang = "Th") => {
    if (!obj) return "";
    const primary = obj[`${field}${lang}`];
    if (primary && primary !== "" && primary !== "null") return primary;

    // Fallback order: Th -> En -> Cn
    return obj[`${field}Th`] || obj[`${field}En`] || obj[`${field}Cn`] || "";
  };

  const extractYoutubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  // YouTube metadata fetching helper (rest of code)
  const fetchYouTubeMeta = async (youtubeId) => {
    if (!youtubeId) return null;
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
          viewCount = item.statistics?.viewCount ? parseInt(item.statistics.viewCount) : null;
          publishedAt = item.snippet?.publishedAt;
          return { viewCount, publishedAt };
        }
      } catch (error) {
        console.error(`Error fetching YouTube API for ${youtubeId}:`, error);
      }
    }

    // Fallback: Scrape if API failed (rest of code)
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
          // Alternative regex for some YouTube versions
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

  const [clipsWithViews, vlogsWithMeta] = await Promise.all([
    Promise.all(shortClips.map(async (clip) => {
      const youtubeId = clip.youtubeId || extractYoutubeId(clip.youtubeUrl);
      const meta = await fetchYouTubeMeta(youtubeId);
      return { ...clip, youtubeId, ...(meta || {}) };
    })),
    Promise.all(vlogs.map(async (vlog) => {
      const youtubeId = vlog.youtubeId || extractYoutubeId(vlog.youtubeUrl);
      const meta = await fetchYouTubeMeta(youtubeId);
      return { ...vlog, youtubeId, ...(meta || {}) };
    }))
  ]);

  return (
    <div className="p-6 mb-8">
      <div className="bg-[#F9FAFB] border p-6 rounded-2xl shadow mb-8 overflow-hidden">
        <ArticleSlider data={cats} />
      </div>
      <div className="flex items-start gap-4">
        <div className="relative overflow-hidden w-full">
          <div>
            {/* Desktop */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cats.map((cat, i) => {
                  if (!cat.article) return;

                  if (i == 0) {
                    return (
                      <div
                        key={i}
                        className="col-span-1 md:col-span-2 max-w-full overflow-hidden"
                      >
                        <div className="flex items-center gap-2 mb-4 max-w-full">
                          <div className="w-1.5 h-6 rounded-2xl bg-[#F06FAA]"></div>
                          <h4 className="text-lg sm:text-xl xl:text-2xl font-bold wrap-break-word">
                            <a
                              href={`/categories/${cat.slug}`}
                              className="hover:text-[#F06FAA] transition"
                            >
                              {cat.name}
                            </a>
                          </h4>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl max-h-[284px]">
                          <a
                            href={`/articles/${cat.article.id}`}
                            className="block max-w-full"
                          >
                            <img
                              src={getLang(cat.article, "thumbnail")}
                              alt=""
                              className="w-full max-w-full h-56 sm:h-64 md:h-full object-cover opacity-80 block"
                            />
                          </a>

                          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-20 max-w-full">
                            <a
                              href={`/articles/${cat.article.id}`}
                              className="shrink-0"
                            >
                              <h6 className="text-white text-sm sm:text-lg font-semibold leading-snug line-clamp-2 wrap-break-word">
                                {getLang(cat.article, "title")}
                              </h6>
                            </a>

                            <p className="mt-1 line-clamp-2 text-white/80 text-[11px] sm:text-sm mb-3 sm:mb-4 wrap-break-word">
                              {getLang(cat.article, "excerpt")}
                            </p>

                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex gap-3 flex-wrap text-[10px] sm:text-xs text-white">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 shrink-0" />{" "}
                                  {new Date(
                                    cat.article.publishedAt
                                  ).toLocaleDateString("th-TH", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 shrink-0" />{" "}
                                  {cat.article.viewCount}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Share2 className="h-3 shrink-0" />{" "}
                                  {cat.article.shareCount}
                                </div>
                              </div>

                              <a
                                href={`/articles/${cat.article.id}`}
                                className="shrink-0"
                              >
                                <span className="text-[#F06FAA] text-xs flex items-center whitespace-nowrap">
                                  อ่านต่อ{" "}
                                  <ArrowRight className="h-3 ml-0.5" />
                                </span>
                              </a>
                            </div>
                          </div>

                          <div
                            className="
                                 pointer-events-none
                                 absolute inset-0
                                 bg-linear-to-b
                                 from-transparent from-10%
                                 to-black/80 to-100%"
                          />
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={i}
                      className="flex flex-col max-w-full overflow-hidden"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-6 rounded-2xl bg-[#F06FAA]"></div>
                        <a
                          href={`/categories/${cat.slug}`}
                          className="hover:text-[#F06FAA] transition"
                        >
                          <h4 className="text-lg sm:text-xl xl:text-2xl font-bold wrap-break-word">
                            {cat.name}
                          </h4>
                        </a>
                      </div>

                      <div className="card border h-full overflow-hidden">
                        <a
                          href={`/articles/${cat.article.id}`}
                          className="block"
                        >
                          <figure className="max-w-full overflow-hidden">
                            <img
                              src={getLang(cat.article, "thumbnail")}
                              alt={getLang(cat.article, "title")}
                              className="h-40 w-full max-w-full object-cover block"
                            />
                          </figure>
                        </a>

                        <div className="card-body p-2 sm:p-3 max-w-full">
                          <a
                            href={`/articles/${cat.article.id}`}
                            className="shrink-0"
                          >
                            <h2 className="card-title line-clamp-1 wrap-break-word">
                              {getLang(cat.article, "title")}
                            </h2>
                          </a>

                          <p className="line-clamp-2 wrap-break-word text-sm">
                            {getLang(cat.article, "excerpt")}
                          </p>

                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap text-[10px] text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="size-2.5 shrink-0" />
                                <span>
                                  {new Date(
                                    cat.article.publishedAt
                                  ).toLocaleDateString("th-TH", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="size-2.5 shrink-0" />
                                <span>{cat.article.viewCount}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Share2 className="size-2.5 shrink-0" />
                                <span>{cat.article.shareCount}</span>
                              </div>
                            </div>

                            <a
                              href={`/articles/${cat.article.id}`}
                              className="shrink-0"
                            >
                              <span className="text-[#3F458D] text-xs flex items-center cursor-pointer whitespace-nowrap">
                                อ่านต่อ{" "}
                                <ArrowRight className="h-2.5 ml-0.5" />
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile + iPad */}
            <div className="lg:hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cats.map((category, i) => {
                  if (!category.article) return;

                  return (
                    <div
                      key={i}
                      className="flex flex-col max-w-full overflow-hidden"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-6 rounded-2xl bg-[#F06FAA]"></div>
                        <a
                          href={`/categories/${category.slug}`}
                          className="hover:text-[#F06FAA] transition"
                        >
                          <h4 className="text-lg font-bold wrap-break-word">
                            {category.name}
                          </h4>
                        </a>
                      </div>

                      <div className="card overflow-hidden house-w-full">
                        <a
                          href={`/articles/${category.article.id}`}
                          className="block"
                        >
                          <figure className="max-w-full overflow-hidden">
                            <img
                              src={getLang(category.article, "thumbnail")}
                              alt={getLang(category.article, "title")}
                              className="h-44 w-full max-w-full object-cover block"
                            />
                          </figure>
                        </a>

                        <div className="card-body p-3 max-w-full">
                          <a
                            href={`/articles/${category.article.id}`}
                            className="block"
                          >
                            <h2 className="card-title line-clamp-1 wrap-break-word">
                              {getLang(category.article, "title")}
                            </h2>
                          </a>

                          <p className="line-clamp-2 wrap-break-word text-sm">
                            {getLang(category.article, "excerpt")}
                          </p>

                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap text-[10px] text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-2.5 shrink-0" />
                                <span>
                                  {new Date(
                                    category.article.publishedAt
                                  ).toLocaleDateString("th-TH", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-2.5 shrink-0" />
                                <span>{category.article.viewCount}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Share2 className="h-2.5 shrink-0" />
                                <span>{category.article.shareCount}</span>
                              </div>
                            </div>

                            <a
                              href={`/articles/${category.article.id}`}
                              className="shrink-0"
                            >
                              <span className="text-[#3F458D] text-xs flex items-center cursor-pointer whitespace-nowrap">
                                อ่านต่อ{" "}
                                <ArrowRight className="h-2.5 ml-0.5" />
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <br /><br />
          <div className="flex flex-col xl:flex-row gap-8 flex-1 mb-4">
            <div className="max-w-full min-w-0 bg-[#F9FAFB] py-10 xl:py-16 px-5 xl:px-8 rounded-4xl w-full">
              <MagazineCarousel data={ssruAround} />
            </div>

            <div className="min-w-0 max-w-full bg-[#F9FAFB] py-10 xl:py-16 px-5 xl:px-8 rounded-4xl w-full">
              <ClipCarousel data={clipsWithViews} />
            </div>
          </div>

          {/* Vlog for Mobile + iPad */}
          <div className="xl:hidden">
            <VlogCarousel data={vlogsWithMeta} />
          </div>

          <div className="flex flex-col xl:hidden gap-8 flex-1 mb-6">

            <div className="xl:hidden mb-8">
              <div className="bg-[#F9FAFB] border border-[#F3F4F6] p-4 rounded-2xl shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-6 bg-[#F06FAA] rounded" />
                  <h4 className="text-xl font-bold text-[#101828]">
                    ยอดนิยม
                  </h4>
                </div>

                <div className="space-y-3">
                  {popularArticles.map((article) => (
                    <a
                      key={article.id}
                      href={`/articles/${article.id}`}
                      className="block bg-white border border-[#F3F4F6] rounded-xl overflow-hidden hover:shadow-sm transition"
                    >
                      <div className="flex gap-3 p-3">
                        {/* image */}
                        <div className="w-24 h-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={getLang(article, "thumbnail")}
                            alt={getLang(article, "title")}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        {/* text */}
                        <div className="min-w-0 flex-1">
                          <h2 className="card-title line-clamp-1 wrap-break-word">
                            {getLang(article, "title")}
                          </h2>

                          <p className="line-clamp-2 wrap-break-word text-sm text-[#475467] mt-1">
                            {getLang(article, "excerpt")}
                          </p>

                          <div className="mt-2 text-xs text-[#99A1AF]">
                            {new Date(article.publishedAt).toLocaleDateString("th-TH", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/*  กล่องรับความเห็น (Mobile)  */}
            <div className="xl:hidden mb-8">
              <CommentForm />
            </div>
          </div>

        </div>
        <div className="pt-2 w-[362px] hidden xl:block space-y-8">
          {/* Desktop */}
          <div className="bg-[#F9FAFB] border border-[#F3F4F6] p-4 rounded-xl hidden xl:block">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-6 bg-[#F06FAA] rounded" />
              <h4 className="text-2xl font-bold">ยอดนิยม</h4>
            </div>

            <ul className="flex flex-col gap-4">
              {popularArticles.map((article, i) => (
                <li key={article.id}>
                  <a
                    href={`/articles/${article.id}`}
                    className="flex gap-4 group"
                  >
                    <div className="text-[#E5E7EB] text-3xl font-bold group-hover:text-[#3F458D] transition w-10">
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    <div className="flex-1">
                      <p className="group-hover:text-[#F06FAA] transition line-clamp-1">
                        {getLang(article, "title")}
                      </p>
                      <p className="text-[#99A1AF] text-sm">
                        {new Date(article.publishedAt).toLocaleDateString(
                          "th-TH",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-[#F06FAA] mb-4">
              อ่านข่าวย้อนหลัง
            </h4>
            <hr className="mb-4" />

            <ul className="space-y-4">
              {cats.map((item) => (
                <li key={item.id}>
                  <div>
                    <h6>
                      <a
                        href={`/categories/${item.slug}`}
                        className="hover:text-[#F06FAA] transition"
                      >
                        {item.name}
                      </a>
                    </h6>

                    <div className="flex gap-2 items-center text-[#99A1AF]"></div>
                  </div>
                </li>
              ))}
            </ul>

            {/* <div className="text-right">
                <a className="text-[#3F458D] hover:underline" href="/categories">
                  อ่านทั้งหมด
                </a>
              </div> */}
          </div>
          <CommentForm />
        </div>
      </div>
      <br />
      {/* Vlog for Desktop (Before Editorial) */}
      <div className="hidden xl:block">
        <VlogCarousel data={vlogsWithMeta} />
      </div>
      <br />
      <div className="bg-[#F9FAFB] border border-[#F3F4F6] p-6 rounded-2xl shadow mb-8">
        <div className="grid grid-cols-1 xl:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-2 h-7 rounded-full bg-[#F06FAA]" />
              <h4 className="text-xl md:text-2xl font-bold text-[#101828] leading-tight">
                {getLang(editorPage, "title") || "สารจากกองบรรณาธิการ"}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 items-start">
              <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm aspect-[4/5] bg-gray-50 flex items-center justify-center">
                {editorPage?.image ? (
                  <img
                    src={editorPage.image}
                    alt="บรรณาธิการ"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/contents/editorial.jpg"
                    alt="บรรณาธิการ"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex flex-col">
                <div className="text-[#475467] leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                  {getLang(editorPage, "content") || `เว็บไซต์ข่าวแห่งนี้เป็นหนึ่งในช่องทางการสื่อสารของมหาวิทยาลัยราชภัฏสวนสุนันทา...`}
                </div>

                <div className="mt-3 text-right">
                  <span className="text-xs md:text-sm text-[#667085]">
                    <span className="font-medium text-[#344054]">
                      {getLang(editorPage, "name") || "ณัฐวลัญช์ วังนิล"}
                      <br />
                      {getLang(editorPage, "position") || "บรรณาธิการ"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 border-t md:border-t-0 md:border-l border-[#E5E7EB]">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-2 h-7 rounded-full bg-[#F06FAA]" />
              <h4 className="text-xl md:text-2xl font-bold text-[#101828] leading-tight">
                {getLang(criteriaPage, "title") || "เกณฑ์ในการส่งบทความ"}
              </h4>
            </div>

            <div className="text-[#475467] leading-relaxed text-sm md:text-base whitespace-pre-wrap">
              {getLang(criteriaPage, "content") || `1. บทความต้องเคารพต่อสถาบันพระมหากษัตริย์...`}
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}

