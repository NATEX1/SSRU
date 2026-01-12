"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import path from "path";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import { revalidatePath } from "next/cache";

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

export async function createShortClip(prevState, formData) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return { success: false, message: "Unauthorized" };
        }

        const type = formData.get("type");
        const titleTh = formData.get("titleTh") || "";
        const titleEn = formData.get("titleEn") || "";
        const titleCn = formData.get("titleCn") || "";

        if (!type || !["upload", "youtube"].includes(type)) {
            return { success: false, message: "ประเภทไม่ถูกต้อง" };
        }

        if (!titleTh && !titleEn && !titleCn) {
            return { success: false, message: "กรุณาใส่ชื่ออย่างน้อย 1 ภาษา" };
        }

        let videoUrl = null;
        let thumbnailUrl = null;
        let youtubeUrl = null;
        let youtubeId = null;

        if (type === "upload") {
            const videoFile = formData.get("video");
            const thumbnailFile = formData.get("thumbnail");

            if (!videoFile || !thumbnailFile) {
                return { success: false, message: "กรุณาเลือกไฟล์วิดีโอและรูปปก" };
            }

            if (videoFile.size > 1024 * 1024 * 1024) {
                return { success: false, message: "วิดีโอต้องไม่เกิน 1GB" };
            }

            if (thumbnailFile.size > 5 * 1024 * 1024) {
                return { success: false, message: "รูปปกต้องไม่เกิน 5MB" };
            }

            videoUrl = await saveFile(videoFile, "videos");
            thumbnailUrl = await saveFile(thumbnailFile, "thumbnails");
        }

        if (type === "youtube") {
            youtubeUrl = formData.get("youtubeUrl");
            if (!youtubeUrl) {
                return { success: false, message: "กรุณาใส่ลิงก์ YouTube" };
            }
            youtubeId = extractYoutubeId(youtubeUrl);
            if (!youtubeId) {
                return { success: false, message: "ลิงก์ YouTube ไม่ถูกต้อง" };
            }
        }

        await prisma.shortClip.create({
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

        revalidatePath("/backoffice/short-clips");
        return { success: true };
    } catch (error) {
        console.error("CREATE ACTION ERROR:", error);
        return { success: false, message: error.message || "เกิดข้อผิดพลาด" };
    }
}

export async function updateShortClip(prevState, formData) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return { success: false, message: "Unauthorized" };
        }

        const id = formData.get("id");
        if (!id) return { success: false, message: "Missing ID" };

        const oldClip = await prisma.shortClip.findUnique({
            where: { id: Number(id) },
        });

        if (!oldClip) {
            return { success: false, message: "ไม่พบข้อมูล" };
        }

        const type = formData.get("type");
        const titleTh = formData.get("titleTh") || "";
        const titleEn = formData.get("titleEn") || "";
        const titleCn = formData.get("titleCn") || "";

        let videoUrl = oldClip.videoUrl;
        let thumbnailUrl = oldClip.thumbnailUrl;
        let youtubeUrl = oldClip.youtubeUrl;
        let youtubeId = oldClip.youtubeId;

        if (type === "youtube" && oldClip.videoUrl) {
            await deleteFile(oldClip.videoUrl);
            await deleteFile(oldClip.thumbnailUrl);
            videoUrl = null;
            thumbnailUrl = null;
        }

        if (type === "upload" && oldClip.youtubeUrl) {
            youtubeUrl = null;
            youtubeId = null;
        }

        if (type === "upload") {
            const videoFile = formData.get("video");
            const thumbnailFile = formData.get("thumbnail");

            if (videoFile && videoFile.size > 0) {
                if (videoFile.size > 1024 * 1024 * 1024) return { success: false, message: "วิดีโอต้องไม่เกิน 1GB" };
                await deleteFile(oldClip.videoUrl);
                videoUrl = await saveFile(videoFile, "videos");
            }

            if (thumbnailFile && thumbnailFile.size > 0) {
                if (thumbnailFile.size > 5 * 1024 * 1024) return { success: false, message: "รูปปกต้องไม่เกิน 5MB" };
                await deleteFile(oldClip.thumbnailUrl);
                thumbnailUrl = await saveFile(thumbnailFile, "thumbnails");
            }
        }

        if (type === "youtube") {
            const newYoutubeUrl = formData.get("youtubeUrl");
            if (newYoutubeUrl) {
                youtubeUrl = newYoutubeUrl;
                youtubeId = extractYoutubeId(youtubeUrl);
                if (!youtubeId) return { success: false, message: "ลิงก์ YouTube ไม่ถูกต้อง" };
            }
        }

        await prisma.shortClip.update({
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

        revalidatePath("/backoffice/short-clips");
        return { success: true };
    } catch (error) {
        console.error("UPDATE ACTION ERROR:", error);
        return { success: false, message: error.message || "เกิดข้อผิดพลาด" };
    }
}

export async function deleteShortClip(id) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return { success: false, message: "Unauthorized" };

        const clip = await prisma.shortClip.findUnique({
            where: { id: Number(id) }
        });

        if (!clip) return { success: false, message: "ไม่พบข้อมูล" };

        await deleteFile(clip.videoUrl);
        await deleteFile(clip.thumbnailUrl);

        await prisma.shortClip.delete({
            where: { id: Number(id) },
        });

        revalidatePath("/backoffice/short-clips");
        return { success: true };
    } catch (error) {
        console.error("DELETE ACTION ERROR:", error);
        return { success: false, message: error.message || "เกิดข้อผิดพลาด" };
    }
}
