
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars
    .replace(/[\s_-]+/g, "-") // Replace spaces with -
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing -
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

    const { name, nameEn, nameCn } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    // Generate slug from English name if available, otherwise Thai Name
    // If Thai, we might just use random ID or timestamp if we want to avoid Thai chars in URL
    // For now, let's try to use English name or fallback to a safe random string if EN is missing
    let slug = "";
    if (nameEn) {
      slug = generateSlug(nameEn);
    } else {
      // Fallback: Use 'cat-' + timestamp
      slug = `cat-${Date.now()}`;
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
      },
    });

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
