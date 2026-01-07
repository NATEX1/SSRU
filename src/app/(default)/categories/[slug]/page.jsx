import Pagination from "@/components/pagination";
import { getAllCategories, getPostsByCategory } from "@/lib/markdown";
import { Eye, Pencil, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getCategoryBySlug(rawSlug, page = 1, limit = 9) {
  const slug = decodeURIComponent(rawSlug);
  const skip = (page - 1) * limit;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      articles: {
        where: {
          status: "approved",
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { name: true },
          },
        },
      },
      _count: {
        select: { articles: true },
      },
    },
  });

  return category;
}

export default async function CategoryPage({ params, searchParams }) {
  const session = await getServerSession(authOptions);
  const { slug } = await params;
  const sp = await searchParams;
  const page = sp?.page || 1;
  const limit = 9;

  const category = await getCategoryBySlug(slug, page, limit);

  const totalPages = Math.ceil(category._count.articles / limit);

  // console.log(posts);

  // ถ้าไม่พบหมวดหมู่
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            ไม่พบหมวดหมู่
          </h1>
          <Link href="/" className="text-blue-600 hover:underline">
            ← กลับหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/category-banner.jpg"
            alt={`Banner ${category.name}`}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div> */}

      <div className="text-center flex flex-col items-center gap-2 mt-8">
        <h2 className="text-[#3F458D] text-4xl font-semibold">
          {category.name}
        </h2>
        {/* <p className="text-[#4A5565]">
          รวบรวมผลงานวิจัยที่โดดเด่นและน่าสนใจจากคณาจารย์และนักศึกษา <br />
          มหาวิทยาลัยราชภัฏสวนสุนันทา
        </p> */}
        <div className=" rounded bg-[#F06FAA] w-24 h-1 mt-8"></div>
      </div>

      {category.articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 mt-8">
            {category.articles.map((article, i) => (
              <div
                className="card shadow-sm group relative overflow-hidden"
                key={i}
              >
                {/* {session && session.user?.id === article.authorId && (
                  <Link
                    href={`/articles/${article.id}/edit`}
                    className="absolute top-2 right-2 bg-black/80 rounded-full size-6 text-white z-20
               flex items-center justify-center hover:bg-black transition"
                  >
                    <Pencil className="size-3" />
                  </Link>
                )} */}

                <figure className="h-40">
                  <a href={`/articles/${article.id}`}>
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="group-hover:scale-105 transition duration-150 h-full w-full object-cover"
                    />
                  </a>
                </figure>
                <div className="card-body">
                  <p className="text-xs text-[#99A1AF] flex gap-1">
                    <span className="text-[#F06FAA]">
                      {article.penName || article.author.name}
                    </span>
                    <span>|</span>
                    <span>
                      {new Date(article.createdAt).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                  <a href={`/articles/${article.slug}`}>
                    <h2 className="card-title line-clamp-2 hover:underline">
                      {article.title}
                    </h2>
                  </a>
                  <p className="text-[#4A5565] line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="card-actions">
                    <div className="flex gap-2">
                      <p className="text-[#99A1AF] flex items-center gap-1">
                        <Eye className="size-[1em]" />
                        <span>{article.viewCount} อ่าน</span>
                      </p>
                      <p className="text-[#99A1AF] flex items-center gap-1">
                        <Share2 className="size-[1em]" />
                        <span>{article.shareCount} แชร์</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-6xl mx-auto px-4">
            <Pagination page={page} totalPages={totalPages} />
          </div>
        </>
      ) : (
        // Empty State
        <div className="max-w-4xl mx-auto px-4 text-center py-16">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              ยังไม่มีบทความในหมวดหมู่นี้
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              เรากำลังเตรียมเนื้อหาคุณภาพสำหรับคุณ
              โปรดติดตามบทความล่าสุดได้ที่หน้ารวมบทความ
            </p>
          </div>
          <div className="space-x-4">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-[#3F458D] text-white rounded-lg hover:bg-[#2f357a] transition-colors"
            >
              ← หน้าหลัก
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ดูบทความทั้งหมด
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
