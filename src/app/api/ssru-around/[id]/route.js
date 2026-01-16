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
        const filepath = path.join(process.cwd(), "public", fileUrl);
        if (existsSync(filepath)) {
            await unlink(filepath);
        }
    } catch (err) {
        console.error("DELETE FILE ERROR:", err);
    }
}

export async function GET(req, { params }) {
    try {
        const { id } = await params;

        const item = await prisma.ssruAround.findUnique({
            where: { id: Number(id) },
        });

        if (!item) {
            return NextResponse.json(
                { success: false, message: "ไม่พบข้อมูล" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: item });
    } catch (error) {
        console.error("GET SINGLE SSRU AROUND ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
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
        const formData = await req.formData();

        const oldItem = await prisma.ssruAround.findUnique({
            where: { id: Number(id) },
        });

        if (!oldItem) {
            return NextResponse.json(
                { success: false, message: "ไม่พบข้อมูล" },
                { status: 404 }
            );
        }

        const titleTh = formData.get("titleTh");
        const titleEn = formData.get("titleEn");
        const titleCn = formData.get("titleCn");
        const issue = formData.get("issue");
        const year = formData.get("year");
        const link = formData.get("link");
        const type = formData.get("type");
        const order = formData.get("order") ? Number(formData.get("order")) : oldItem.order;

        const imageFileTh = formData.get("imageTh");
        const imageFileEn = formData.get("imageEn");
        const imageFileCn = formData.get("imageCn");

        let imageUrlTh = oldItem.imageTh;
        if (imageFileTh && typeof imageFileTh === "object") {
            if (oldItem.imageTh) await deleteFile(oldItem.imageTh);
            imageUrlTh = await saveFile(imageFileTh, "ssru-around");
        }

        let imageUrlEn = oldItem.imageEn;
        if (imageFileEn && typeof imageFileEn === "object") {
            if (oldItem.imageEn) await deleteFile(oldItem.imageEn);
            imageUrlEn = await saveFile(imageFileEn, "ssru-around");
        }

        let imageUrlCn = oldItem.imageCn;
        if (imageFileCn && typeof imageFileCn === "object") {
            if (oldItem.imageCn) await deleteFile(oldItem.imageCn);
            imageUrlCn = await saveFile(imageFileCn, "ssru-around");
        }

        const updatedItem = await prisma.ssruAround.update({
            where: { id: Number(id) },
            data: {
                titleTh: titleTh || oldItem.titleTh,
                titleEn: titleEn,
                titleCn: titleCn,
                title: titleTh || oldItem.title, // Also update title for compatibility
                issue,
                year,
                link,
                type,
                order,
                imageTh: imageUrlTh,
                imageEn: imageUrlEn,
                imageCn: imageUrlCn,
                image: imageUrlTh, // Also update image for compatibility
            },
        });

        return NextResponse.json({ success: true, data: updatedItem });
    } catch (error) {
        console.error("UPDATE SSRU AROUND ERROR:", error);
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

        const item = await prisma.ssruAround.findUnique({
            where: { id: Number(id) },
        });

        if (!item) {
            return NextResponse.json(
                { success: false, message: "ไม่พบข้อมูล" },
                { status: 404 }
            );
        }

        // Delete image files if exist
        if (item.imageTh) await deleteFile(item.imageTh);
        if (item.imageEn) await deleteFile(item.imageEn);
        if (item.imageCn) await deleteFile(item.imageCn);

        await prisma.ssruAround.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ success: true, message: "ลบข้อมูลสำเร็จ" });
    } catch (error) {
        console.error("DELETE SSRU AROUND ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
