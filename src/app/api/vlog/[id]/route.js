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
        const body = await req.json();
        const { titleTh, titleEn, titleCn, youtubeUrl, order } = body;

        const youtubeId = getYouTubeId(youtubeUrl);

        const updatedVlog = await prisma.vlog.update({
            where: { id: Number(id) },
            data: {
                titleTh,
                titleEn,
                titleCn,
                youtubeUrl,
                youtubeId,
                order: order ? Number(order) : undefined,
            },
        });

        return NextResponse.json({ success: true, data: updatedVlog });
    } catch (error) {
        console.error("UPDATE VLOG ERROR:", error);
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

        await prisma.vlog.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ success: true, message: "ลบข้อมูลสำเร็จ" });
    } catch (error) {
        console.error("DELETE VLOG ERROR:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
