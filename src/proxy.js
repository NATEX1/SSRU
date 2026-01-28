import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default async function middleware(req) {
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
