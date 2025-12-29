import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function generateUniqueSlug(title) {
  const baseSlug = title.trim().replace(/\s+/g, "-");
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const exists = await prisma.article.findUnique({
      where: { slug },
    });

    if (!exists) break;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}


export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) return NextResponse.json({message: 'ไม่ได้รับอนุญาต'}, {status: 401})

    const authorId = session.user.id
    const formData = await req.formData();

    const title = formData.get("title");
    const content = formData.get("content");
    const categoryId = parseInt(formData.get("categoryId") || "0");
    const status = formData.get("status") || "draft";
    const tagsArray = JSON.parse(formData.get("tags") || "[]");

    if (!title || !slug || !content || !categoryId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // handle thumbnail
    let thumbnailPath = null;
    const thumbnailFile = formData.get("thumbnail");
    if (thumbnailFile && thumbnailFile.arrayBuffer) {
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      const fileName = Date.now() + "-" + thumbnailFile.name;
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);
      fs.writeFileSync(filePath, buffer);
      thumbnailPath = "/uploads/" + fileName;
    }

    const slug = await generateUniqueSlug(title)

    // create article first
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        categoryId,
        authorId,
        thumbnail: thumbnailPath,
        status,
      },
    });

    // loop tags + create ArticleTag
    for (const tagName of tagsArray) {
      // find or create tag
      let tag = await prisma.tag.findUnique({ where: { name: tagName } });
      if (!tag) {
        tag = await prisma.tag.create({ data: { name: tagName } });
      }

      // create junction table
      await prisma.articleTag.create({
        data: {
          articleId: article.id,
          tagId: tag.id,
        },
      });
    }

    return NextResponse.json({ success: true, article }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;

    const category = searchParams.get("category")
    const q = searchParams.get("q");

    const where = {}

    if (q) {
      where.OR = [
        {
          title: {
            contains: q,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: q,
            mode: "insensitive",
          },
        },
      ];
    }

    if (category && category !== "all"){
      where.categoryId = Number(category); 
    }

    // Query articles พร้อม relation
    const articles = await prisma.article.findMany({
      where,
      skip: offset,
      take: limit,
      include: {
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
            createdAt: true,
          }
        },
        category: true,
      },
      orderBy: { createdAt: "desc" },
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
      { success: false, message: "Error fetching articles", error: error.message },
      { status: 500 }
    );
  }
}
