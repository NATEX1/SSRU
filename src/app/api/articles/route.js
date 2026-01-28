import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function generateUniqueSlug(title, excludeId = null) {
  const baseSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const exists = await prisma.article.findUnique({
      where: { slug },
    });

    if (!exists || (excludeId && exists.id === excludeId)) {
      break;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}


export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "ไม่ได้รับอนุญาต" }, { status: 401 });
    }

    const formData = await req.formData();
    const categoryId = parseInt(formData.get("categoryId") || "0");
    const status = formData.get("status") || "draft";
    const authorType = formData.get("authorType") || "user";
    const isCompiled = formData.get("isCompiled") === "true";

    // Multilingual Fields
    const titleTh = formData.get("titleTh") || "";
    const titleEn = formData.get("titleEn") || "";
    const titleCn = formData.get("titleCn") || "";

    const contentTh = formData.get("contentTh") || "";
    const contentEn = formData.get("contentEn") || "";
    const contentCn = formData.get("contentCn") || "";

    const excerptTh = formData.get("excerptTh") || "";
    const excerptEn = formData.get("excerptEn") || "";
    const excerptCn = formData.get("excerptCn") || "";

    const keywordsTh = formData.get("keywordsTh") || "";
    const keywordsEn = formData.get("keywordsEn") || "";
    const keywordsCn = formData.get("keywordsCn") || "";

    const penNameTh = formData.get("penNameTh") || "";
    const penNameEn = formData.get("penNameEn") || "";
    const penNameCn = formData.get("penNameCn") || "";

    const positionTh = formData.get("positionTh") || "";
    const positionEn = formData.get("positionEn") || "";
    const positionCn = formData.get("positionCn") || "";

    const compilerNameTh = formData.get("compilerNameTh") || "";
    const compilerNameEn = formData.get("compilerNameEn") || "";
    const compilerNameCn = formData.get("compilerNameCn") || "";

    const compilerPositionTh = formData.get("compilerPositionTh") || "";
    const compilerPositionEn = formData.get("compilerPositionEn") || "";
    const compilerPositionCn = formData.get("compilerPositionCn") || "";

    // Validation: At least one language must have title and content
    const hasTh = titleTh && contentTh;
    const hasEn = titleEn && contentEn;
    const hasCn = titleCn && contentCn;

    if (!hasTh && !hasEn && !hasCn) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอกข้อมูลครบอย่างน้อย 1 ภาษา (หัวข้อและเนื้อหา)" },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: "กรุณาเลือกหมวดหมู่" },
        { status: 400 }
      );
    }

    // Handle thumbnails for each language
    const handleUpload = async (fileKey) => {
      const file = formData.get(fileKey);
      if (file && file.size > 0 && file.arrayBuffer) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${fileKey}-${file.name}`;
        const filePath = path.join(process.cwd(), "public", "uploads", fileName);
        fs.writeFileSync(filePath, buffer);
        return "/uploads/" + fileName;
      }
      return null;
    };

    const thumbnailTh = await handleUpload("thumbnailTh");
    const thumbnailEn = await handleUpload("thumbnailEn");
    const thumbnailCn = await handleUpload("thumbnailCn");

    // Slug based on priority: TH -> EN -> CN
    const slugSource = titleTh || titleEn || titleCn;
    const slug = await generateUniqueSlug(slugSource);

    const articleData = {
      slug,
      categoryId,
      status,
      authorId: session.user.id,
      authorType,
      isCompiled,

      titleTh, titleEn, titleCn,
      contentTh, contentEn, contentCn,
      excerptTh, excerptEn, excerptCn,
      keywordsTh, keywordsEn, keywordsCn,
      thumbnailTh, thumbnailEn, thumbnailCn,

      // Pen name / Compiler info
      penNameTh: authorType === "penname" ? penNameTh : null,
      penNameEn: authorType === "penname" ? penNameEn : null,
      penNameCn: authorType === "penname" ? penNameCn : null,

      positionTh: authorType === "penname" ? positionTh : null,
      positionEn: authorType === "penname" ? positionEn : null,
      positionCn: authorType === "penname" ? positionCn : null,

      compilerNameTh: (authorType === "penname" && isCompiled) ? compilerNameTh : null,
      compilerNameEn: (authorType === "penname" && isCompiled) ? compilerNameEn : null,
      compilerNameCn: (authorType === "penname" && isCompiled) ? compilerNameCn : null,

      compilerPositionEn: (authorType === "penname" && isCompiled) ? compilerPositionEn : null,
      compilerPositionCn: (authorType === "penname" && isCompiled) ? compilerPositionCn : null,
    };

    const article = await prisma.article.create({
      data: articleData,
    });

    return NextResponse.json({ success: true, article }, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;

    const category = searchParams.get("category");
    const q = searchParams.get("q");

    const where = {
      NOT: {
        status: 'draft'
      }
    };

    if (q) {
      where.OR = [
        { titleTh: { contains: q, mode: "insensitive" } },
        { titleEn: { contains: q, mode: "insensitive" } },
        { titleCn: { contains: q, mode: "insensitive" } },
        { contentTh: { contains: q, mode: "insensitive" } },
        { contentEn: { contains: q, mode: "insensitive" } },
        { contentCn: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category && category !== "all") {
      where.categoryId = Number(category);
    }

    // Query articles พร้อม relation
    const articles = await prisma.article.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        category: true,
        tags: {
          include: { tag: true },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            position: true,
            status: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // นับจำนวนทั้งหมด
    const total = await prisma.article.count();

    return NextResponse.json({
      success: true,
      articles,
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
        message: "Error fetching articles",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
