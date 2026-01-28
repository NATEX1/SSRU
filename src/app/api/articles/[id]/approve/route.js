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

    await prisma.article.update({
      where: { id: Number(id) },
      data: {
        status: "approved",
        approvedAt: new Date(),
        approvedById: Number(session.user.id),
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

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
