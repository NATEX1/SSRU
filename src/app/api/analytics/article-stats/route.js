import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req) {
    const session = await getServerSession(authOptions);

    if (!session || !["admin", "approver"].includes(session.user.role)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filterType = searchParams.get("filter") || "month"; // day, month, year

    try {
        const articles = await prisma.article.findMany({
            where: {
                status: { not: "draft" }
            },
            select: {
                status: true,
                createdAt: true,
                approvedAt: true,
                rejectedAt: true,
            }
        });

        const stats = {};
        console.log(`Processing ${articles.length} articles for stats`);

        articles.forEach(article => {
            let date;
            if (article.status === "approved") date = article.approvedAt || article.createdAt;
            else if (article.status === "rejected") date = article.rejectedAt || article.createdAt;
            else date = article.createdAt;

            if (!date) return;
            const timestamp = new Date(date);

            let key;
            if (filterType === "day") {
                key = timestamp.toISOString().split("T")[0];
            } else if (filterType === "month") {
                // By month in current year (YYYY-MM)
                key = `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}`;
            } else {
                key = timestamp.getFullYear().toString();
            }

            if (!stats[key]) {
                stats[key] = { name: key, pending: 0, approved: 0, rejected: 0 };
            }
            stats[key][article.status]++;
        });

        const data = Object.values(stats).sort((a, b) => a.name.localeCompare(b.name));
        console.log(`Returning ${data.length} data points for article stats`);

        return NextResponse.json({ data });
    } catch (err) {
        console.error("Article Stats API Error:", err);
        return NextResponse.json({
            message: "Internal Server Error",
            error: err.message,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined
        }, { status: 500 });
    }
}
