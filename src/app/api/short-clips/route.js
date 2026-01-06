import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    // 1. Auth
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const contentType = req.headers.get("content-type") || "";

    // ================= UPLOAD =================
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      const type = formData.get("type"); // upload
      if (type !== "upload") {
        return NextResponse.json(
          { success: false, message: "Invalid type" },
          { status: 400 }
        );
      }

      const titleTh = formData.get("titleTh");
      const titleEn = formData.get("titleEn");
      const titleCn = formData.get("titleCn");

      // 🔥 สมมุติว่า upload เสร็จแล้ว ได้ URL มา
      const videoUrl = formData.get("videoUrl");
      const thumbnailUrl = formData.get("thumbnailUrl");

      if (!titleTh || !videoUrl) {
        return NextResponse.json(
          { success: false, message: "Missing required fields" },
          { status: 400 }
        );
      }

      const clip = await prisma.shortClip.create({
        data: {
          type: "upload",
          titleTh,
          titleEn,
          titleCn,
          videoUrl,
          thumbnailUrl,
        },
      });

      return NextResponse.json({ success: true, data: clip });
    }

    // ================= YOUTUBE =================
    const body = await req.json();
    const { type, titleTh, titleEn, titleCn, youtubeUrl } = body;

    if (type !== "youtube") {
      return NextResponse.json(
        { success: false, message: "Invalid type" },
        { status: 400 }
      );
    }

    if (!youtubeUrl || !titleTh) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const youtubeId =
      youtubeUrl.split("v=")[1]?.split("&")[0] ||
      youtubeUrl.split("youtu.be/")[1];

    if (!youtubeId) {
      return NextResponse.json(
        { success: false, message: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const clip = await prisma.shortClip.create({
      data: {
        type: "youtube",
        titleTh,
        titleEn,
        titleCn,
        youtubeUrl,
        youtubeId,
      },
    });

    return NextResponse.json({ success: true, data: clip });
  } catch (error) {
    console.error("CREATE SHORT CLIP ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
