import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import path from "path";
import { unlink } from "fs/promises";
import { existsSync } from "fs";

async function deleteFile(fileUrl) {
    if (!fileUrl) return;
    try {
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

import { parseForm } from "@/lib/upload-helper";

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

        const oldClip = await prisma.shortClip.findUnique({
            where: { id: Number(id) },
        });

        if (!oldClip) {
            return NextResponse.json(
                { success: false, message: "ไม่พบข้อมูล" },
                { status: 404 }
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

        let videoUrl = oldClip.videoUrl;
        let thumbnailUrl = oldClip.thumbnailUrl;
        let youtubeUrl = oldClip.youtubeUrl;
        let youtubeId = oldClip.youtubeId;

        if (type === 'youtube' && oldClip.videoUrl) {
            await deleteFile(oldClip.videoUrl);
            await deleteFile(oldClip.thumbnailUrl);
            videoUrl = null;
            thumbnailUrl = null;
        }

        if (type === 'upload' && oldClip.youtubeUrl) {
            youtubeUrl = null;
            youtubeId = null;
        }

        if (type === "upload") {
            const videoFile = files.video;
            const thumbnailFile = files.thumbnail;

            if (videoFile) {
                if (videoFile.size > 1024 * 1024 * 1024) {
                    return NextResponse.json({ success: false, message: "วิดีโอต้องไม่เกิน 1GB" }, { status: 400 });
                }
                await deleteFile(oldClip.videoUrl);
                videoUrl = videoFile.url;
            }

            if (thumbnailFile) {
                if (thumbnailFile.size > 5 * 1024 * 1024) {
                    return NextResponse.json({ success: false, message: "รูปปกต้องไม่เกิน 5MB" }, { status: 400 });
                }
                await deleteFile(oldClip.thumbnailUrl);
                thumbnailUrl = thumbnailFile.url;
            }
        }

        if (type === "youtube") {
            const newYoutubeUrl = fields.youtubeUrl;
            if (newYoutubeUrl) {
                youtubeUrl = newYoutubeUrl;
                youtubeId = extractYoutubeId(youtubeUrl);
                if (!youtubeId) {
                    return NextResponse.json({ success: false, message: "ลิงก์ YouTube ไม่ถูกต้อง" }, { status: 400 });
                }
            }
        }

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
