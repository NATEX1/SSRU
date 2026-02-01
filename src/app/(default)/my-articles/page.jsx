import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getMultilingualContent } from "@/lib/multilingual";
// import { Badge } from "@/components/ui/badge"
import { Pencil, Trash } from "lucide-react";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const articles = await prisma.article.findMany({
    where: {
      authorId: Number(session.user.id),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-5xl mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">บทความของฉัน</h1>
        <Link href="/dashboard/articles/create">
          <Button>เขียนบทความใหม่</Button>
        </Link>
      </div>

      {articles.length === 0 && (
        <p className="text-muted-foreground">ยังไม่มีบทความ</p>
      )}

      <div className="space-y-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className="flex items-center justify-between border rounded-lg p-4"
          >
            <div>
              <h3 className="font-medium">
                {getMultilingualContent(article, "title") || "ไม่มีหัวข้อ"}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/articles/${article.id}/edit`}>
                <Button variant="ghost" size="sm">
                  <Pencil className="size-4" />
                </Button>
              </Link>

              {/* ปุ่มลบ → client component */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
