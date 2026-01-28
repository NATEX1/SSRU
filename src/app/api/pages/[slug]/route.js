import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
    try {
        const { slug } = await params;

        const page = await prisma.page.findUnique({
            where: { slug },
        });

        if (!page) {
            return NextResponse.json({
                success: true,
                data: {
                    slug,
                    image: "",
                    titleTh: "",
                    titleEn: "",
                    titleCn: "",
                    contentTh: "",
                    contentEn: "",
                    contentCn: "",
                    nameTh: "",
                    nameEn: "",
                    nameCn: "",
                    positionTh: "",
                    positionEn: "",
                    positionCn: "",
                },
            });
        }

        return NextResponse.json({ success: true, data: page });
    } catch (error) {
        console.error("GET PAGE ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
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

        const { slug } = await params;
        const body = await req.json();
        const {
            image,
            titleTh, titleEn, titleCn,
            contentTh, contentEn, contentCn,
            nameTh, nameEn, nameCn,
            positionTh, positionEn, positionCn
        } = body;

        const updatedPage = await prisma.page.upsert({
            where: { slug },
            update: {
                image,
                titleTh,
                titleEn,
                titleCn,
                contentTh,
                contentEn,
                contentCn,
                nameTh,
                nameEn,
                nameCn,
                positionTh,
                positionEn,
                positionCn,
            },
            create: {
                slug,
                image,
                titleTh,
                titleEn,
                titleCn,
                contentTh,
                contentEn,
                contentCn,
                nameTh,
                nameEn,
                nameCn,
                positionTh,
                positionEn,
                positionCn,
            },
        });

        return NextResponse.json({ success: true, data: updatedPage });
    } catch (error) {
        console.error("UPDATE PAGE ERROR:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
