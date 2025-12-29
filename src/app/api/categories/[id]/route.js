import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        articles: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                position: true,
                status: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Error fetching a category",
    });
  }
}
