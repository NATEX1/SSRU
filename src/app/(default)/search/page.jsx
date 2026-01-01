import prisma from "@/lib/prisma";
import { Eye, Share2 } from "lucide-react";
import React from "react";

async function fetchArticlesWithKeyword(q) {
  if (!q) return [];

  return await prisma.article.findMany({
    where: {
      OR: [
        {
          title: {
            contains: q,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: q,
              mode: "insensitive",
            },
          },
        },
      ],
      //   status: 'approved'
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
}

export default async function page({ searchParams }) {
  const { q } = await searchParams;
  const articles = await fetchArticlesWithKeyword(q);

//   console.log(articles);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-xl font-semibold mb-4 text-gray-500">
        ผลการค้นหา: "{q}"
      </h1>

      {articles.length === 0 && (
        <p className="text-muted-foreground">ไม่พบข้อมูล</p>
      )}

      <div className="grid grid-cols-3 gap-4">
        {articles.map((item) => (
          <div className="card shadow-sm group" key={item.id}>
            <figure className="w-full h-60 overflow-hidden">
              <a href={`/articles/${item.slug}`}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-150"
                />
              </a>
            </figure>

            <div className="card-body">
              <p className="text-xs text-[#99A1AF]">
                <span className="text-[#F06FAA]">
                  {item.authorType == "penname"
                    ? item.penName
                    : item.author.name}
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
              <a href="">
                <h2 className="card-title hover:underline">{item.title}</h2>
              </a>
              <p className="text-[#4A5565] line-clamp-2">{item.excerpt}</p>
              <div className="card-actions">
                <div className="flex gap-2">
                  <p className="text-[#99A1AF] flex items-center gap-1">
                    <Eye className="size-[1em]" />
                    <span>1,250 อ่าน</span>
                  </p>
                  <p className="text-[#99A1AF] flex items-center gap-1">
                    <Share2 className="size-[1em]" />
                    <span>45 แชร์</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
