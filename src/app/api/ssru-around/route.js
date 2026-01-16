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

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        const titleTh = formData.get("titleTh");
        const titleEn = formData.get("titleEn");
        const titleCn = formData.get("titleCn");
        const issue = formData.get("issue");
        const year = formData.get("year");
        const link = formData.get("link");
        const type = formData.get("type");
        const order = formData.get("order") ? Number(formData.get("order")) : 1;

        const imageFileTh = formData.get("imageTh");
        const imageFileEn = formData.get("imageEn");
        const imageFileCn = formData.get("imageCn");

        if (!titleTh) {
            return NextResponse.json(
                { success: false, message: "กรุณาใส่หัวข้อภาษาไทย" },
                { status: 400 }
            );
        }

        let imageUrlTh = null;
        if (imageFileTh && typeof imageFileTh === "object") {
            imageUrlTh = await saveFile(imageFileTh, "ssru-around");
        }

        let imageUrlEn = null;
        if (imageFileEn && typeof imageFileEn === "object") {
            imageUrlEn = await saveFile(imageFileEn, "ssru-around");
        }

        let imageUrlCn = null;
        if (imageFileCn && typeof imageFileCn === "object") {
            imageUrlCn = await saveFile(imageFileCn, "ssru-around");
        }

        const item = await prisma.ssruAround.create({
            data: {
                titleTh,
                titleEn,
                titleCn,
                title: titleTh, // Also save to title for compatibility
                issue,
                year,
                link,
                type,
                order,
                imageTh: imageUrlTh,
                imageEn: imageUrlEn,
                imageCn: imageUrlCn,
                image: imageUrlTh, // Also save to image for compatibility
            },
        });

        return NextResponse.json({ success: true, data: item });
    } catch (error) {
        console.error("CREATE SSRU AROUND ERROR:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get("limit") || 10);
        const search = searchParams.get("search") || "";

        const skip = (page - 1) * limit;

        const where = search
            ? {
                OR: [
                    { titleTh: { contains: search, mode: "insensitive" } },
                    { titleEn: { contains: search, mode: "insensitive" } },
                    { titleCn: { contains: search, mode: "insensitive" } },
                    { issue: { contains: search, mode: "insensitive" } },
                    { year: { contains: search, mode: "insensitive" } },
                ],
            }
            : {};

        const [items, total] = await Promise.all([
            prisma.ssruAround.findMany({
                where,
                orderBy: [{ order: "asc" }, { createdAt: "desc" }],
                skip,
                take: limit,
            }),
            prisma.ssruAround.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            data: items,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("GET SSRU AROUND ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    // Bulk update for ordering
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { items } = await req.json();

        if (!items || !Array.isArray(items)) {
            return NextResponse.json(
                { success: false, message: "Invalid data format" },
                { status: 400 }
            );
        }

        await prisma.$transaction(
            items.map((item) =>
                prisma.ssruAround.update({
                    where: { id: Number(item.id) },
                    data: { order: Number(item.order) },
                })
            )
        );

        return NextResponse.json({ success: true, message: "Orders updated successfully" });
    } catch (error) {
        console.error("BULK UPDATE SSRU AROUND ERROR:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
