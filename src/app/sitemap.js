import prisma from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://kcc.ssru.ac.th";

export default async function sitemap() {
  const articles = await prisma.article.findMany({
    where: { status: "approved" },
    select: { id: true, updatedAt: true },
  });

  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  const clips = await prisma.shortClip.findMany({
    select: { id: true, updatedAt: true },
  });

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
    },

    {
      url: `${BASE_URL}/contact-us`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/ssru-around`,
      lastModified: new Date(),
    },

    // Articles
    ...articles.map((a) => ({
      url: `${BASE_URL}/articles/${a.id}`,
      lastModified: a.updatedAt,
    })),

    // Categories
    ...categories.map((c) => ({
      url: `${BASE_URL}/categories/${c.slug}`,
      lastModified: new Date(),
    })),

    // Short clips
    ...clips.map((c) => ({
      url: `${BASE_URL}/ssru-around/${c.id}`,
      lastModified: c.updatedAt,
    })),
  ];
}
