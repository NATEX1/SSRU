import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)

    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 10)
    const search = searchParams.get("search") || ""

    const skip = (page - 1) * limit

    const where = search
      ? {
        OR: [
          { titleTh: { contains: search, mode: "insensitive" } },
          { titleEn: { contains: search, mode: "insensitive" } },
          { titleCn: { contains: search, mode: "insensitive" } },
        ],
      }
      : {}

    const [shortClips, total] = await Promise.all([
      prisma.shortClip.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.shortClip.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: shortClips,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("GET SHORT CLIPS ERROR:", error)
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}