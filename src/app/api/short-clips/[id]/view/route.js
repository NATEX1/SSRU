import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req, { params }) {
    try {
        const { id } = await params;

        const clip = await prisma.shortClip.update({
            where: { id: Number(id) },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                viewCount: clip.viewCount,
            },
        });
    } catch (error) {
        console.error("INCREMENT VIEW ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
