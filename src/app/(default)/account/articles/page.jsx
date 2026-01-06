import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import DeleteButton from "./delete-button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

const PAGE_SIZE = 10;

export default async function Page({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  const skip = (page - 1) * PAGE_SIZE;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: {
        authorId: Number(session.user.id),
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.article.count({
      where: {
        authorId: Number(session.user.id),
      },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-6 sm:py-10 flex items-start sm:items-center justify-center">
      <div className="w-full max-w-xl lg:max-w-3xl bg-white border rounded-2xl shadow-sm p-5 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#101828]">บทความของฉัน</h1>
          <Link href="/write" className="w-full sm:w-auto">
            <Plus className="size-4 mr-2" />
            <Button>เขียนบทความใหม่</Button>
          </Link>
        </div>

        {articles.length === 0 && (
          <div className="border rounded-xl p-6 text-center">
            <p className="text-muted-foreground">ยังไม่มีบทความ</p>
          </div>
        )}

        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
                           border rounded-xl p-4 hover:bg-gray-50 transition"
            >
              <div className="min-w-0">
                <a href={`/articles/${article.id}`} target="_blank">
                  <h3 className="font-medium line-clamp-1 hover:underline">
                    {article.title}
                  </h3>
                </a>
                <div className="text-sm text-muted-foreground mt-1">
                  {article.createdAt.toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:justify-end">
                <Link href={`/articles/${article.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="size-4" />
                  </Button>
                </Link>

                <DeleteButton id={article.id} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
            {/* Previous */}
            <a
              href={`?page=${page - 1}`}
              className={`btn border btn-square btn-sm ${
                page <= 1 ? "btn-disabled" : ""
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </a>

            {/* Page numbers */}
            {(() => {
              const delta = 2;
              const start = Math.max(1, page - delta);
              const end = Math.min(totalPages, page + delta);
              const items = [];

              if (start > 1) {
                items.push(1);
                if (start > 2) items.push("...");
              }

              for (let i = start; i <= end; i++) {
                items.push(i);
              }

              if (end < totalPages) {
                if (end < totalPages - 1) items.push("...");
                items.push(totalPages);
              }

              return items.map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="px-2 text-sm text-muted-foreground">
                    …
                  </span>
                ) : (
                  <a
                    key={p}
                    href={`?page=${p}`}
                    className={`btn btn-sm ${
                      p === page ? "btn-primary" : "border"
                    }`}
                  >
                    {p}
                  </a>
                )
              );
            })()}

            {/* Next */}
            <a
              href={`?page=${page + 1}`}
              className={`btn border btn-square btn-sm ${
                page >= totalPages ? "btn-disabled" : ""
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
