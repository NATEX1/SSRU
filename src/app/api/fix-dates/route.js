import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const articles = await prisma.article.findMany({
            where: {
                status: "approved",
                publishedAt: { not: null }
            }
        });

        let details = [];
        for (const article of articles) {
            const date = new Date(article.publishedAt);
            if (date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0) {
                const newDate = new Date(date.getTime() - 7 * 60 * 60 * 1000);

                await prisma.article.update({
                    where: { id: article.id },
                    data: { publishedAt: newDate }
                });

                details.push({
                    id: article.id,
                    old: date.toISOString(),
                    new: newDate.toISOString()
                });
            }
        }

        return NextResponse.json({
            success: true,
            updatedCount: details.length,
            details
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
