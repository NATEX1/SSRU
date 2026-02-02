import prisma from "@/lib/prisma";
import { ArrowLeft, Calendar, Eye, Share2, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { render } from "@/lib/render";
import BackButton from "../back-button";
import ViewCounter from "../view-couter";
import ShareButtons from "../share-buttons";

import { getMultilingualContent } from "@/lib/multilingual";

async function getArticleById(id) {
  const article = await prisma.article.findUnique({
    where: { id: Number(id) },
    include: {
      author: {
        select: { name: true, position: true, image: true },
      },
    },
  });
  return article;
}

// getContent helper removed - now using central utility

export async function generateMetadata({ params }) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) return { title: "ไม่พบบทความ" };

  const title = getMultilingualContent(article, "title");
  const excerpt = getMultilingualContent(article, "excerpt");
  const thumbnail = getMultilingualContent(article, "thumbnail");

  const baseUrl = "https://kcc.ssru.ac.th";
  const imageUrl = thumbnail && thumbnail.startsWith('http')
    ? thumbnail
    : (thumbnail ? `${baseUrl}${thumbnail}` : `${baseUrl}/assets/images/og-fallback.png`); // Fallback if no thumbnail

  return {
    title,
    description: excerpt,
    alternates: {
      canonical: `${baseUrl}/articles/${id}`,
    },
    openGraph: {
      title,
      description: excerpt,
      url: `${baseUrl}/articles/${id}`,
      siteName: "SSRU KCC",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "th_TH",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: excerpt,
      images: [imageUrl],
    },
  };
}

export default async function page({ params }) {
  const { id } = await params;
  const article = await getArticleById(id);

  console.log("DEBUG ARTICLE:", JSON.stringify({
    id: article?.id,
    authorType: article?.authorType,
    author: article?.author,
    penNameTh: article?.penNameTh,
    penName: article?.penName
  }, null, 2));

  if (!article) return notFound();

  // Current language (default to TH for now)
  const lang = "Th";

  const title = getMultilingualContent(article, "title", lang);
  const content = getMultilingualContent(article, "content", lang);
  const keywords = getMultilingualContent(article, "keywords", lang);
  const excerpt = getMultilingualContent(article, "excerpt", lang);

  // Pen Name / Position logic
  const penName = getMultilingualContent(article, "penName", lang);
  const position = getMultilingualContent(article, "position", lang);
  const compilerName = getMultilingualContent(article, "compilerName", lang);
  const compilerPosition = getMultilingualContent(article, "compilerPosition", lang);

  const html = render(content);

  return (
    <div className="max-w-7xl text-wrap mx-auto px-4 py-6">
      <ViewCounter articleId={article.id} />
      <BackButton />

      {/* Top meta + title */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 sm:gap-x-3">
          <div className="flex gap-1 text-sm items-center text-[#F06FAA]">
            <User className="h-4 shrink-0" />
            <span className="wrap-break-word">
              {(article.authorType === "penname" ? penName : article.author?.name) || article.penName || "SSRU (Fallback)"}
            </span>
          </div>
          <div className="hidden sm:flex text-sm items-center text-[#D1D5DC]">|</div>

          <div className="flex gap-1 text-sm items-center text-[#F06FAA]">
            <Calendar className="h-4 shrink-0" />
            <span>
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="flex justify-between">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#3F458D] leading-snug">
            {title}
          </h1>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="text-[#6A7282] text-sm flex items-center gap-1">
            <Eye className="h-4" />
            <span>{article.viewCount} อ่าน</span>
          </div>
          <div className="text-[#6A7282] text-sm flex items-center gap-1">
            <Share2 className="h-4" />
            <span>{article.shareCount} แชร์</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article
        className="prose prose-base sm:prose-lg max-w-none mt-6 wrap-break-word"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Author box */}
      <div className="mt-8 bg-[#F9FAFB] rounded-2xl border border-[#F3F4F6] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="border-2 border-white shadow size-14 sm:size-[60px] rounded-full overflow-hidden shrink-0">
            <img
              src={article.author?.image || "/assets/images/user.png"}
              className="w-full h-full object-cover"
              alt={penName || article.author?.name}
            />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-[#6A7282]">
              {article.authorType === "penname" && article.isCompiled
                ? "เรียบเรียงโดย"
                : "ผู้เขียนบทความ"}
            </p>
            <p className="text-[#3F458D] text-sm font-bold wrap-break-word">
              {article.authorType === "penname"
                ? (article.isCompiled ? compilerName : penName)
                : article.author?.name}
            </p>
            <p className="text-[#4A5565] text-sm wrap-break-word">
              {article.authorType === "penname"
                ? (article.isCompiled ? compilerPosition : position)
                : article.author?.position}
            </p>
          </div>
        </div>
      </div>

      {/* Keywords + Share */}
      <div className="mt-8 border-t border-[#E5E7EB] pt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="text-[#6A7282] text-sm">
          <strong className="text-black mr-2">คำค้นหา:</strong>
          {keywords ? (
            keywords.split(",").map((keyword, index, array) => (
              <span key={index}>
                {keyword}
                {index < array.length - 1 && ", "}
              </span>
            ))
          ) : (
            <span>-</span>
          )}
        </div>

        <div className="sm:shrink-0">
          <ShareButtons title={title} articleId={article.id} />
        </div>
      </div>
    </div>
  );
}
