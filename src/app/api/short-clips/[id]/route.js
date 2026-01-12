import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import path from "path";
import { writeFile, mkdir, unlink } from "fs/promises";
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

async function deleteFile(fileUrl) {
    if (!fileUrl) return;
    try {
        // fileUrl example: /uploads/videos/123-abc.mp4
        const filepath = path.join(process.cwd(), "public", fileUrl);
        if (existsSync(filepath)) {
            await unlink(filepath);
        }
    } catch (err) {
        console.error("DELETE FILE ERROR:", err);
    }
}

function extractYoutubeId(url) {
    const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/
    );
    return match ? match[1] : null;
}

export async function PUT(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Check if exists
        const oldClip = await prisma.shortClip.findUnique({
            where: { id: Number(id) },
        });

        if (!oldClip) {
            return NextResponse.json(
                { success: false, message: "ไม่พบข้อมูล" },
                { status: 404 }
            );
        }

        const formData = await req.formData();
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

        let videoUrl = oldClip.videoUrl;
        let thumbnailUrl = oldClip.thumbnailUrl;
        let youtubeUrl = oldClip.youtubeUrl;
        let youtubeId = oldClip.youtubeId;

        // Changes logic based on type switching
        // If switching from upload to youtube, delete old files
        if (type === 'youtube' && oldClip.videoUrl) {
            await deleteFile(oldClip.videoUrl);
            await deleteFile(oldClip.thumbnailUrl);
            videoUrl = null;
            thumbnailUrl = null;
        }

        // If switching from youtube to upload
        if (type === 'upload' && oldClip.youtubeUrl) {
            youtubeUrl = null;
            youtubeId = null;
        }

        // ================= UPLOAD =================
        if (type === "upload") {
            const videoFile = formData.get("video");
            const thumbnailFile = formData.get("thumbnail");

            if (videoFile && typeof videoFile === 'object') {
                if (videoFile.size > 1024 * 1024 * 1024) {
                    return NextResponse.json({ success: false, message: "วิดีโอต้องไม่เกิน 1GB" }, { status: 400 });
                }
                // Delete old video
                await deleteFile(oldClip.videoUrl);
                videoUrl = await saveFile(videoFile, "videos");
            }

            if (thumbnailFile && typeof thumbnailFile === 'object') {
                if (thumbnailFile.size > 5 * 1024 * 1024) {
                    return NextResponse.json({ success: false, message: "รูปปกต้องไม่เกิน 5MB" }, { status: 400 });
                }
                // Delete old thumbnail
                await deleteFile(oldClip.thumbnailUrl);
                thumbnailUrl = await saveFile(thumbnailFile, "thumbnails");
            }
        }

        // ================= YOUTUBE =================
        if (type === "youtube") {
            const newYoutubeUrl = formData.get("youtubeUrl");
            if (newYoutubeUrl) {
                youtubeUrl = newYoutubeUrl;
                youtubeId = extractYoutubeId(youtubeUrl);
                if (!youtubeId) {
                    return NextResponse.json({ success: false, message: "ลิงก์ YouTube ไม่ถูกต้อง" }, { status: 400 });
                }
            }
        }

        // Update
        const updatedClip = await prisma.shortClip.update({
            where: { id: Number(id) },
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

        return NextResponse.json({ success: true, data: updatedClip });

    } catch (error) {
        console.error("UPDATE SHORT CLIP ERROR:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const clip = await prisma.shortClip.findUnique({
            where: { id: Number(id) },
        });

        if (!clip) {
            return NextResponse.json(
                { success: false, message: "ไม่พบข้อมูล" },
                { status: 404 }
            );
        }

        // Delete files
        await deleteFile(clip.videoUrl);
        await deleteFile(clip.thumbnailUrl);

        await prisma.shortClip.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ success: true, message: "ลบข้อมูลสำเร็จ" });
    } catch (error) {
        console.error("DELETE SHORT CLIP ERROR:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
