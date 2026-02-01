import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const article = await prisma.article.findUnique({
      where: { id: Number(id) },
    });

    if (!article) {
      return NextResponse.json({ message: "ไม่พบบทความ" }, { status: 404 });
    }

    let publishedAt = null;
    try {
      const body = await req.json();
      publishedAt = body.publishedAt;
    } catch (e) {
      // Body might be empty, ignore
    }

    // Use raw SQL to bypass Prisma's automatic updatedAt update
    const finalPublishedAt = publishedAt ? new Date(`${publishedAt}T00:00:00+07:00`) : new Date();
    const now = new Date();

    await prisma.$executeRaw`
      UPDATE articles 
      SET 
        status = 'approved',
        approved_at = ${now},
        approved_by_id = ${Number(session.user.id)},
        published_at = ${finalPublishedAt}
      WHERE id = ${Number(id)}
    `;

    return NextResponse.json({
      success: true,
      message: "อนุมัติบทความเรียบร้อย",
    });
  } catch (error) {
    console.error("Approval Error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Server error",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
}
