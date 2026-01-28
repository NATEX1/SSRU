import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function getYouTubeId(url) {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
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

        const { titleTh, titleEn, titleCn, youtubeUrl, order: orderFromForm } = await req.json();

        if (!titleTh) {
            return NextResponse.json(
                { success: false, message: "กรุณาใส่หัวข้อภาษาไทย" },
                { status: 400 }
            );
        }

        const youtubeId = getYouTubeId(youtubeUrl);

        // ================= ORDER LOGIC =================
        let order;
        if (orderFromForm !== undefined && orderFromForm !== null && orderFromForm !== "") {
            order = Number(orderFromForm);
        } else {
            const count = await prisma.vlog.count();
            order = count + 1;
        }

        const vlog = await prisma.vlog.create({
            data: {
                titleTh,
                titleEn,
                titleCn,
                youtubeUrl,
                youtubeId,
                order,
            },
        });

        return NextResponse.json({ success: true, data: vlog });
    } catch (error) {
        console.error("CREATE VLOG ERROR:", error);
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
                ],
            }
            : {};

        const [vlogs, total, totalRecords] = await Promise.all([
            prisma.vlog.findMany({
                where,
                orderBy: [{ order: "desc" }, { createdAt: "desc" }],
                skip,
                take: limit,
            }),
            prisma.vlog.count({ where }),
            prisma.vlog.count(),
        ]);

        return NextResponse.json({
            success: true,
            data: vlogs,
            totalRecords,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("GET VLOG ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
