import prisma from "@/lib/prisma";
import { ArrowLeft, Calendar, Eye, Share2, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import ShareButtons from "../../[slug]/ShareButtons";
import { render } from "@/lib/render";
import BackButton from "../back-button";

async function getArticleBySlug(rawSlug) {
  const slug = decodeURIComponent(rawSlug);
  const article = await prisma.article.findUnique({
    where: {
      slug,
    },
    include: {
      author: {
        select: {
          name: true,
          position: true,
          image: true,
        },
      },
    },
  });

  return article;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kcc-uat.ssru.ac.th";

  return {
    title: `KCC - ${article.title}`,
    description: article.excerpt || "อ่านบทความคุณภาพจาก KCC",
    openGraph: {
      title: article.title,
      description: article.excerpt || "อ่านบทความคุณภาพจาก KCC",
      images: article.thumbnail
        ? [{ url: `${baseUrl}${article.thumbnail}` }]
        : [{ url: `${baseUrl}/default-thumbnail.jpg` }], // กำหนด default ถ้าไม่มี thumbnail
      type: "article",
      publishedTime: new Date(article.createdAt).toISOString(),
    },
  };
}


export default async function page({ params }) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);

  if (!article) return notFound();

  const html = render(article.content);

  console.log(article);

  return (
    <div className="max-w-7xl text-wrap mx-auto px-4 py-6">
      <BackButton />

      {/* Top meta + title */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 sm:gap-x-3">
          <div className="flex gap-1 text-sm items-center text-[#F06FAA]">
            <User className="h-4 shrink-0" />
            <span className="wrap-break-word">
              {article.penName || article.author.name}
            </span>
          </div>
          <div className="hidden sm:flex text-sm items-center text-[#D1D5DC]">
            |
          </div>

          <div className="flex gap-1 text-sm items-center text-[#F06FAA]">
            <Calendar className="h-4 shrink-0" />
            <span>
              {new Date(article.createdAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-[#3F458D] leading-snug">
          {article.title}
        </h1>

        {/* stats row (stack on mobile if tight) */}
        <div className="flex flex-wrap gap-4">
          <div className="text-[#6A7282] text-sm flex items-center gap-1">
            <Eye className="h-4" />
            <span>123 อ่าน</span>
          </div>
          <div className="text-[#6A7282] text-sm flex items-center gap-1">
            <Share2 className="h-4" />
            <span>4 แชร์</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article
        className="prose prose-base sm:prose-lg max-w-none mt-6 wrap-break-word"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Author box (responsive) */}
      <div className="mt-8 bg-[#F9FAFB] rounded-2xl border border-[#F3F4F6] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="border-2 border-white shadow size-14 sm:size-[60px] rounded-full overflow-hidden shrink-0">
            <img
              src={article.author?.image || "/assets/images/user.png"}
              className="w-full h-full object-cover"
              alt={article.penName || article.author?.name}
            />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-[#6A7282]">ผู้เขียนบทความ</p>
            <p className="text-[#3F458D] text-sm font-bold wrap-break-word">
              {article.penName || article.author?.name}
            </p>
            <p className="text-[#4A5565] text-sm wrap-break-word">
              {article.author?.position || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Keywords + Share (responsive) */}
      <div className="mt-8 border-t border-[#E5E7EB] pt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="text-[#6A7282] text-sm">
          <strong className="text-black mr-2">คำค้นหา:</strong>
          {article.keywords ? (
            article.keywords.split(",").map((keyword, index) => (
              <span key={index}>
                {keyword}
                {index < article.keywords.length - 1 && ", "}
              </span>
            ))
          ) : (
            <span>-</span>
          )}
        </div>

        <div className="sm:shrink-0">
          <ShareButtons title={article.title} />
        </div>
      </div>
    </div>
  );
}
