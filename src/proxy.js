import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default async function middleware(req) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host");

  // 1. WWW to Non-WWW Redirect
  if (hostname && hostname.startsWith("www.")) {
    const newHost = hostname.replace(/^www\./, "");
    const newUrl = req.nextUrl.clone();
    // Use the URL constructor behavior or just replace the host header in the cloned URL
    newUrl.protocol = "https";
    return NextResponse.redirect(newUrl.toString().replace("www.", ""), 301);
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
