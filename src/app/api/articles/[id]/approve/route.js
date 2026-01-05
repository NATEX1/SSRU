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
      where: { slug },
    });

    if (!article) {
      return NextResponse.json({ message: "ไม่พบบทความ" }, { status: 404 });
    }

    await prisma.article.update({
      where: { id: Number(id) },
      data: {
        status: "approved",
        approvedAt: new Date(),
        approvedById: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "อนุมัติบทความเรียบร้อย",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
