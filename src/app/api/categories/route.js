
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import slugify from "slugify";

// Helper to generate slug from name
function generateSlug(name) {
  return slugify(name, { lower: true, strict: true, locale: "th" });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "all";

    const skip = (page - 1) * limit;

    const where = {
      AND: [
        search
          ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { nameEn: { contains: search, mode: "insensitive" } },
              { nameCn: { contains: search, mode: "insensitive" } },
            ],
          }
          : {},
        filter === "missing_en"
          ? { OR: [{ nameEn: null }, { nameEn: "" }] }
          : filter === "missing_cn"
            ? { OR: [{ nameCn: null }, { nameCn: "" }] }
            : {},
      ],
    };

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: "desc" },
      }),
      prisma.category.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      categories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, nameEn, nameCn, icon } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    // Generate slug strategy:
    // 1. Try English Name
    // 2. Try Thai Name
    // 3. Fallback to Timestamp
    let slugBase = "";
    if (nameEn) {
      slugBase = nameEn;
    } else if (name) {
      slugBase = name;
    } else {
      slugBase = `category-${Date.now()}`;
    }

    let slug = generateSlug(slugBase);

    // If slug is empty after processing (e.g. only special chars), fallback
    if (!slug) {
      slug = `category-${Date.now()}`;
    }

    // Ensure slug is unique
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.category.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const category = await prisma.category.create({
      data: {
        name,
        nameEn,
        nameCn,
        slug: uniqueSlug,
        icon,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
