import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const links = await prisma.socialLink.findMany({
            where: { siteId: 1 },
        });

        // Convert array to object: { facebook: "url", youtube: "url" }
        const linksMap = links.reduce((acc, link) => {
            acc[link.platform] = link.url;
            return acc;
        }, {});

        return NextResponse.json(linksMap);
    } catch (error) {
        console.error("GET SOCIAL LINKS ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
        }

        const body = await req.json();
        const platforms = ["facebook", "youtube", "twitter", "line", "instagram", "tiktok"];

        // Ensure site setting exists
        await prisma.siteSetting.upsert({
            where: { id: 1 },
            update: {},
            create: { id: 1 },
        });

        for (const platform of platforms) {
            const url = body[platform];
            if (url) {
                // Upsert if URL is provided
                const existingLink = await prisma.socialLink.findFirst({
                    where: { siteId: 1, platform },
                });

                if (existingLink) {
                    await prisma.socialLink.update({
                        where: { id: existingLink.id },
                        data: { url },
                    });
                } else {
                    await prisma.socialLink.create({
                        data: {
                            siteId: 1,
                            platform,
                            url,
                            icon: platform, // Simple default
                        },
                    });
                }
            } else {
                // Optional: Delete if URL is empty? Or just ignore? 
                // For now, let's just ignore empty/removal to correspond with "save if exists" logic
                // But better UX is usually clearing it removes it.
                // Let's implement removal for cleaner DB.
                const existingLink = await prisma.socialLink.findFirst({
                    where: { siteId: 1, platform },
                });

                if (existingLink) {
                    await prisma.socialLink.delete({
                        where: { id: existingLink.id }
                    });
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PUT SOCIAL LINKS ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
