import { ArrowLeft, Calendar, Eye, LinkIcon, Share2, User } from "lucide-react";
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
    <div className="max-w-[1250px] mx-auto p-4">
      <Link
        href="/"
        className="flex items-center text-sm text-[#6A7282] mb-8 hover:underline"
      >
        <ArrowLeft className="h-3" />
        กลับหน้ารวมรายการ
      </Link>

      <div className="space-y-4">
        <div className="flex gap-2 items-center">
          <div className="flex gap-1 text-sm items-center text-[#F06FAA]">
            <User className="h-3" /> <span>{article.author}</span>
          </div>
          <div className="flex text-sm items-center text-[#D1D5DC]">|</div>
          <div className="flex gap-1 text-sm items-center text-[#F06FAA]">
            <Calendar className="h-3" /> <span>{article.date}</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-[#3F458D]">{article.title}</h1>

        <div className="gap-6 flex">
          <div className="text-[#6A7282] text-sm flex items-center">
            <Eye className="h-3" />
            <span>{article.readCount.toLocaleString()} อ่าน</span>
          </div>
          <div className="text-[#6A7282] text-sm flex items-center">
            <Share2 className="h-3" />
            <span>{article.shareCount.toLocaleString()} แชร์</span>
          </div>
        </div>
      </div>

      {article.thumbnail && (
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-[800px] h-[450px] rounded-2xl mx-auto my-8"
        />
      )}

      <article className="prose prose-lg max-w-none">
        <ReactMarkdown
          children={article.content}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        />
      </article>

      <div className="flex gap-4 bg-[#F9FAFB] rounded-2xl border border-[#F3F4F6] p-6 my-8">
        <div className="border-2 border-white shadow size-[60px] rounded-full overflow-hidden">
          <img
            src={`/contents/${article.authorImage}`}
            className="w-full h-full object-cover"
            alt={article.author}
            
          />{article}
        </div>
        <div>
          <p className="text-xs text-[#6A7282]">ผู้เขียนบทความ</p>
          <p className="text-[#3F458D] text-lg font-bold">{article.author}</p>
          <p className="text-[#4A5565] text-sm">
            {article.authotPosition}
          </p>
        </div>
      </div>

      <div className="border-t border-[#E5E7EB] py-6 flex justify-between items-center">
        <div>
          <p className="text-[#6A7282]">
            <strong className="text-black">คำค้นหา</strong>:{" "}
            {article.keywords.map((keyword, index) => (
              <span key={index}>
                {keyword}
                {index < article.keywords.length - 1 && ", "}
              </span>
            ))}
          </p>
        </div>

        <ShareButtons title={article.title} />
      </div>
    </div>
  );
}
