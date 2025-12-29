import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const articleId = Number(id);

    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
      include: {
        author: {
            select: {
                id: true,
            name: true,
            email: true,
            role: true,
            position: true,
            status: true,
            createdAt: true,
            }
        },
        category: true,
        tags: {
          include: { tag: true },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error fetching article" },
      { status: 500 }
    );
  }
}
