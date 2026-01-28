
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const count = await prisma.article.count({
            where: {
                status: "pending",
            },
        });

        return NextResponse.json({ success: true, count });
    } catch (error) {
        console.error("Fetch pending count error", error);
        return NextResponse.json(
            { success: false, message: "Error fetching pending count" },
            { status: 500 }
        );
    }
}
