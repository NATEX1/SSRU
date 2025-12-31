import { ArrowLeft, Calendar, Eye, Share2, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPostSlugs } from "@/lib/markdown";
import ReactMarkdown from "react-markdown";
import ShareButtons from "./ShareButtons";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const article = getPostBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[#6A7282] mb-6 hover:underline"
      >
        <ArrowLeft className="h-4" />
        กลับหน้ารวมรายการ
      </Link>

      {/* Top meta + title */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 sm:gap-x-3">
          <div className="flex gap-1 text-sm items-center text-[#F06FAA]">
            <User className="h-4 shrink-0" />
            <span className="break-words">{article.author}</span>
          </div>
          <div className="hidden sm:flex text-sm items-center text-[#D1D5DC]">|</div>

          <div className="flex gap-1 text-sm items-center text-[#F06FAA]">
            <Calendar className="h-4 shrink-0" />
            <span>{article.date}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-[#3F458D] leading-snug">
          {article.title}
        </h1>

        {/* stats row (stack on mobile if tight) */}
        <div className="flex flex-wrap gap-4">
          <div className="text-[#6A7282] text-sm flex items-center gap-1">
            <Eye className="h-4" />
            <span>{Number(article.readCount || 0).toLocaleString()} อ่าน</span>
          </div>
          <div className="text-[#6A7282] text-sm flex items-center gap-1">
            <Share2 className="h-4" />
            <span>{Number(article.shareCount || 0).toLocaleString()} แชร์</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="prose prose-base sm:prose-lg max-w-none mt-6">
        <ReactMarkdown
          children={article.content}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        />
      </article>

      {/* Author box (responsive) */}
      <div className="mt-8 bg-[#F9FAFB] rounded-2xl border border-[#F3F4F6] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="border-2 border-white shadow size-[56px] sm:size-[60px] rounded-full overflow-hidden shrink-0">
            <img
              src={article.authorImage || "/assets/images/user.png"}
              className="w-full h-full object-cover"
              alt={article.author}
            />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-[#6A7282]">ผู้เขียนบทความ</p>
            <p className="text-[#3F458D] text-lg font-bold break-words">
              {article.author}
            </p>
            <p className="text-[#4A5565] text-sm break-words">
              {article.authorPosition || article.authotPosition}
            </p>
          </div>
        </div>
      </div>

      {/* Keywords + Share (responsive) */}
      <div className="mt-8 border-t border-[#E5E7EB] pt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="text-[#6A7282] text-sm">
          <strong className="text-black">คำค้นหา</strong>:{" "}
          {Array.isArray(article.keywords) && article.keywords.length > 0 ? (
            article.keywords.map((keyword, index) => (
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
