import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/write") && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    pathname.startsWith("/backoffice") &&
    (!token || token.role !== "admin")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
