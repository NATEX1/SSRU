import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const articles = await prisma.article.findMany({
            where: { status: "approved" },
            orderBy: { publishedAt: "desc" },
            take: 10,
            select: {
                id: true,
                titleTh: true,
                publishedAt: true,
                status: true
            }
        });

        return NextResponse.json({
            serverTimeUtc: new Date().toISOString(),
            articles: articles.map(a => ({
                ...a,
                publishedAtIso: a.publishedAt ? a.publishedAt.toISOString() : null
            }))
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
