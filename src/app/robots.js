export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kcc.ssru.ac.th";

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
