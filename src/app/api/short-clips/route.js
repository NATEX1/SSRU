import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


function extractYoutubeId(url) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/
  );
  return match ? match[1] : null;
}

import { parseForm } from "@/lib/upload-helper";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { fields, files } = await parseForm(req);
    const type = fields.type;

    const titleTh = fields.titleTh || "";
    const titleEn = fields.titleEn || "";
    const titleCn = fields.titleCn || "";

    if (!type || !["upload", "youtube"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "ประเภทไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    if (!titleTh && !titleEn && !titleCn) {
      return NextResponse.json(
        { success: false, message: "กรุณาใส่ชื่ออย่างน้อย 1 ภาษา" },
        { status: 400 }
      );
    }

    let videoUrl = null;
    let thumbnailUrl = null;
    let youtubeUrl = null;
    let youtubeId = null;

    if (type === "upload") {
      const videoFile = files.video;
      const thumbnailFile = files.thumbnail;

      if (!videoFile || !thumbnailFile) {
        return NextResponse.json(
          { success: false, message: "กรุณาเลือกไฟล์วิดีโอและรูปปก" },
          { status: 400 }
        );
      }

      // Validation (Size check handled partly during stream or here after)
      // Busboy streams, so we check size after if needed, or monitor stream.
      // Here we check written bytes.
      if (videoFile.size > 1024 * 1024 * 1024) { // 1GB
        // Note: Clean up file if needed, but for now just error
        return NextResponse.json({ success: false, message: "วิดีโอต้องไม่เกิน 1GB" }, { status: 400 });
      }

      if (thumbnailFile.size > 5 * 1024 * 1024) { // 5MB
        return NextResponse.json({ success: false, message: "รูปปกต้องไม่เกิน 5MB" }, { status: 400 });
      }

      videoUrl = videoFile.url;
      thumbnailUrl = thumbnailFile.url;
    }

    if (type === "youtube") {
      youtubeUrl = fields.youtubeUrl;

      if (!youtubeUrl) {
        return NextResponse.json(
          { success: false, message: "กรุณาใส่ลิงก์ YouTube" },
          { status: 400 }
        );
      }

      youtubeId = extractYoutubeId(youtubeUrl);
      if (!youtubeId) {
        return NextResponse.json(
          { success: false, message: "ลิงก์ YouTube ไม่ถูกต้อง" },
          { status: 400 }
        );
      }
    }

    const clip = await prisma.shortClip.create({
      data: {
        titleTh,
        titleEn,
        titleCn,
        videoUrl,
        thumbnailUrl,
        youtubeUrl,
        youtubeId,
      },
    });

    return NextResponse.json({ success: true, data: clip });
  } catch (error) {
    console.error("CREATE SHORT CLIP ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

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