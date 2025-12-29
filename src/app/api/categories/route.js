import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch categories",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { name, slug } = await req.json();

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: "Name and slug are required" },
        { status: 400 }
      );
    }

    // สร้าง Category ใหม่
    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error creating category", error: error.message },
      { status: 500 }
    );
  }
}
