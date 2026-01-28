import prisma from "@/lib/prisma";
import { Eye, Share2 } from "lucide-react";
import React from "react";
import { getMultilingualContent } from "@/lib/multilingual";

export default async function page({ searchParams }) {
  const { q } = await searchParams;


  const articles = await prisma.article.findMany({
    where: {
      status: "approved",
      OR: [
        { titleTh: { contains: q, mode: "insensitive" } },
        { titleEn: { contains: q, mode: "insensitive" } },
        { titleCn: { contains: q, mode: "insensitive" } },
        { contentTh: { contains: q, mode: "insensitive" } },
        { contentEn: { contains: q, mode: "insensitive" } },
        { contentCn: { contains: q, mode: "insensitive" } },
        {
          category: {
            name: { contains: q, mode: "insensitive" },
          },
        },
      ],
    },
    include: {
      category: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-xl font-semibold mb-4 text-gray-500">
        ผลการค้นหา: "{q}"
      </h1>

      {articles.length === 0 && (
        <p className="text-muted-foreground">ไม่พบข้อมูล</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((item) => {
          const title = getMultilingualContent(item, "title");
          const thumbnail = getMultilingualContent(item, "thumbnail");
          const excerpt = getMultilingualContent(item, "excerpt");
          const penName = getMultilingualContent(item, "penName");

          return (
            <div className="card shadow-sm group" key={item.id}>
              <figure className="w-full h-60 overflow-hidden">
                <a href={`/articles/${item.id}`}>
                  <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-150"
                  />
                </a>
              </figure>

              <div className="card-body wrap-break-word">
                <p className="text-xs text-[#99A1AF]">
                  <span className="text-[#F06FAA]">
                    {item.authorType === "penname"
                      ? (penName || item.penName || "SSRU")
                      : (item.author?.name || "SSRU")}
                  </span>
                  <span className="mx-1">|</span>
                  <span>
                    {new Date(item.createdAt).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </p>
                <a href={`/articles/${item.id}`}>
                  <h2 className="card-title hover:underline">{title}</h2>
                </a>
                <p className="text-[#4A5565] line-clamp-2">{excerpt}</p>
                <div className="card-actions">
                  <div className="flex gap-2">
                    <p className="text-[#99A1AF] flex items-center gap-1">
                      <Eye className="size-[1em]" />
                      <span>{item.viewCount} อ่าน</span>
                    </p>
                    <p className="text-[#99A1AF] flex items-center gap-1">
                      <Share2 className="size-[1em]" />
                      <span>{item.shareCount} แชร์</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
