import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  try {
    await prisma.article.update({
      where: { slug },
      data: {
        shareCount: { increment: 1 },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: "Article not found" },
      { status: 404 }
    );
  }
}
