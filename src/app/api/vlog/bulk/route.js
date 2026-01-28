import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req) {
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
                prisma.vlog.update({
                    where: { id: Number(item.id) },
                    data: { order: Number(item.order) },
                })
            )
        );

        return NextResponse.json({ success: true, message: "Orders updated successfully" });
    } catch (error) {
        console.error("BULK UPDATE VLOG ERROR:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
