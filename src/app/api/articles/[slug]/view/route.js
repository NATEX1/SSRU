import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const cookieStore = await cookies();
  const key = `viewed_${slug}`;

  // already viewed
  if (cookieStore.get(key)) {
    return NextResponse.json({ ok: true });
  }

  const article = await prisma.article.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!article) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  await prisma.article.update({
    where: { slug },
    data: {
      views: { increment: 1 },
    },
  });

  cookieStore.set(key, "1", {
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
  });

  return NextResponse.json({ ok: true });
}
