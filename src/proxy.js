import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default async function middleware(req) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host");

  // 1. WWW to Non-WWW Redirect
  if (hostname && hostname.startsWith("www.")) {
    const newHostname = hostname.replace(/^www\./, "");
    url.hostname = newHostname;
    url.protocol = "https"; // Force HTTPS for SEO
    return NextResponse.redirect(url, 301);
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/write") && !token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (
    pathname.startsWith("/backoffice") &&
    (!token || !["admin", "approver"].includes(token.role))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    pathname.startsWith("/account") &&
    (!token)
  ) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}
