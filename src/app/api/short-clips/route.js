import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";

async function saveFile(file, folder) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(uploadDir, filename);

  await writeFile(filepath, buffer);

  return `/uploads/${folder}/${filename}`;
}

function extractYoutubeId(url) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/
  );
  return match ? match[1] : null;
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Try catch specifically for FormData parsing to give better error
    let formData;
    try {
      formData = await req.formData();
    } catch (e) {
      console.error("FormData Error:", e);
      return NextResponse.json(
        { success: false, message: "Upload failed. File might be too large or invalid." },
        { status: 400 }
      );
    }

    const type = formData.get("type");

    const titleTh = formData.get("titleTh") || "";
    const titleEn = formData.get("titleEn") || "";
    const titleCn = formData.get("titleCn") || "";

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
      const videoFile = formData.get("video");
      const thumbnailFile = formData.get("thumbnail");

      if (!videoFile || !thumbnailFile) {
        return NextResponse.json(
          { success: false, message: "กรุณาเลือกไฟล์วิดีโอและรูปปก" },
          { status: 400 }
        );
      }

      // Additional safety check for file object
      if (typeof videoFile !== 'object' || typeof thumbnailFile !== 'object') {
        return NextResponse.json({ success: false, message: "Invalid file data" }, { status: 400 });
      }

      if (videoFile.size > 1024 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: "วิดีโอต้องไม่เกิน 1GB" },
          { status: 400 }
        );
      }

      if (thumbnailFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: "รูปปกต้องไม่เกิน 5MB" },
          { status: 400 }
        );
      }

      videoUrl = await saveFile(videoFile, "videos");
      thumbnailUrl = await saveFile(thumbnailFile, "thumbnails");
    }

    if (type === "youtube") {
      youtubeUrl = formData.get("youtubeUrl");

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