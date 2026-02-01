import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import DeleteButton from "./delete-button";
import { getMultilingualContent } from "@/lib/multilingual";
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
    <div className="max-w-5xl mx-auto py-10 px-4 mt-8 border rounded-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">บทความของฉัน</h1>
        <Link href="/write">
          <Button>เขียนบทความใหม่</Button>
        </Link>
      </div>

      {articles.length === 0 && (
        <p className="text-muted-foreground">ยังไม่มีบทความ</p>
      )}

      <div className="space-y-4">
        {articles.map((article) => {
          const statusMap = {
            draft: {
              label: "Draft",
              className: "text-gray-500",
            },
            pending: {
              label: "Pending",
              className: "text-orange-600",
            },
            approved: {
              label: "Approved",
              className: "text-green-600",
            },
            rejected: {
              label: "Rejected",
              className: "text-red-600",
            },
          };

          const status = statusMap[article.status] || {
            label: article.status,
            className: "text-gray-500",
          };

          const isApproved = ["approved", "pending"].includes(article.status);

          return (
            <div
              key={article.id}
              className="flex items-center justify-between border rounded-lg p-4"
            >
              <div>
                <a href={`/articles/${article.id}`} target="_blank">
                  <h3 className="font-medium line-clamp-1 hover:underline">
                    {getMultilingualContent(article, "title") || "ไม่มีชื่อเรื่อง"}
                  </h3>
                </a>

                <div className="text-sm text-muted-foreground mt-1">
                  {(article.publishedAt || article.createdAt).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                <div className={`text-sm font-medium mt-0.5 ${status.className}`}>
                  {status.label}
                </div>
              </div>

              {/* ปุ่มจะซ่อนเมื่อ Approved */}
              {!isApproved && (
                <div className="flex items-center gap-2">
                  <Link href={`/articles/${article.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="size-4" />
                    </Button>
                  </Link>

                  <DeleteButton id={article.id} />
                </div>
              )}
            </div>
          );
        })}
      </div>


      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {/* Previous */}
          <a
            href={`?page=${page - 1}`}
            className={`btn border btn-square btn-sm ${page <= 1 ? "btn-disabled" : ""
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
                <span key={`dots-${i}`} className="px-2 text-base-content/50">
                  …
                </span>
              ) : (
                <a
                  key={p}
                  href={`?page=${p}`}
                  className={`btn btn-sm ${p === page ? "btn-primary" : "border"
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
            className={`btn border btn-square btn-sm ${page >= totalPages ? "btn-disabled" : ""
              }`}
          >
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}
