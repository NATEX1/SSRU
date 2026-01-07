export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api",
          "/auth",
          "/account",
          "/dashboard",
        ],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml` ||"https://kcc.ssru.ac.th/sitemap.xml",
  }
}
