import prisma from "@/lib/prisma";

const BASE_URL_RAW = (process.env.NEXT_PUBLIC_BASE_URL || "https://kcc.ssru.ac.th");
const BASE_URL = BASE_URL_RAW.replace(/https?:\/\/www\./, "https://").replace(/\/$/, "");

export default async function sitemap() {
  try {
    const articles = await prisma.article.findMany({
      where: { status: "approved" },
      select: { id: true, updatedAt: true },
    }).catch(() => []);

    const categories = await prisma.category.findMany({
      select: { slug: true },
    }).catch(() => []);

    const clips = await prisma.shortClip.findMany({
      select: { id: true, updatedAt: true },
    }).catch(() => []);

    return [
      // Home
      {
        url: BASE_URL,
        lastModified: new Date(),
      },

      // Static pages
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
        lastModified: a.updatedAt || new Date(),
      })),

      // Categories
      ...categories.map((c) => ({
        url: `${BASE_URL}/categories/${c.slug}`,
        lastModified: new Date(),
      })),

      // Short clips
      ...clips.map((c) => ({
        url: `${BASE_URL}/short-clips/${c.id}`,
        lastModified: c.updatedAt || new Date(),
      })),
    ];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    // Fallback minimal sitemap to prevent 500 error
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
      },
    ];
  }
}
