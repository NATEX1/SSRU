import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { id } = await params;

  // ตรวจสอบว่า article มีอยู่
  const article = await prisma.article.findUnique({
    where: { id: Number(id) },
    select: { id: true },
  });

  if (!article) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  // เพิ่ม viewCount ทันที
  await prisma.article.update({
    where: { id: Number(id) },
    data: { viewCount: { increment: 1 } },
  });

  return NextResponse.json({ ok: true });
}
