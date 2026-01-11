export default function robots() {
  const baseUrlRaw = process.env.NEXT_PUBLIC_BASE_URL || "https://kcc.ssru.ac.th";

  const baseUrl = baseUrlRaw.replace("https://www.", "https://");

  return {
    rules: [
      {
        userAgent: "*",
        disallow: [
          "/api",
          "/auth",
          "/account",
          "/backoffice",
          "/write",
          "/articles/*/edit",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
