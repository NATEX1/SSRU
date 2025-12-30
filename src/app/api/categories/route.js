import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

async function generateUniqueSlug(title) {
  const baseSlug = title.trim().replace(/\s+/g, "-");
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const exists = await prisma.category.findUnique({
      where: { slug },
    });

    if (!exists) break;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const skip = (page - 1) * limit;

    const where = q
      ? {
          name: {
            contains: q,
            mode: "insensitive",
          },
        }
      : {};

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy: { id: "desc" },
        skip,
        take: limit,
      }),
      prisma.category.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
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
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name are required" },
        { status: 400 }
      );
    }

    const slug = await generateUniqueSlug(name)
    // สร้าง Category ใหม่
    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(
      { success: true, category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating category",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
