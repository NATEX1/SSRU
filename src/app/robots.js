export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api",
          "/admin",
          "/auth",
          "/dashboard",
        ],
      },
    ],
    sitemap: process.env.NEXT_PUBLIC_BASE_URL ||"https://kcc.ssru.ac.th/sitemap.xml",
  }
}
