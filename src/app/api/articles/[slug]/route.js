import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import path from 'path'

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

export async function GET(req, { params }) {
  try {
    const { slug } = await params;

    const article = await prisma.article.findUnique({
      where: {
        slug,
      },
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
        approvedBy: {
          select: {
            id: true,
            name: true
          }
        },
        category: true,
        tags: {
          include: { tag: true },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error fetching article" },
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

    // ตรวจสอบว่าบทความมีอยู่หรือไม่
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    // ตรวจสอบสิทธิ์ในการแก้ไข
    const isAuthor = existingArticle.authorId === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "Forbidden: You don't have permission to edit this article" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const categoryId = formData.get("categoryId");
    const status = formData.get("status");
    const keywords = formData.get("keywords");
    const excerpt = formData.get("excerpt");
    const authorType = formData.get("authorType");
    const penName = formData.get("penName");
    const position = formData.get("position");
    const thumbnail = formData.get("thumbnail");

    // Validate required fields
    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // สร้าง slug ใหม่จาก title (ถ้า title เปลี่ยน)
    let newSlug = slug;
    if (title !== existingArticle.title) {
      newSlug = await generateUniqueSlug(title, existingArticle.id);
    }

    // จัดการ thumbnail
    let thumbnailPath = existingArticle.thumbnail;
    if (thumbnail && thumbnail.size > 0) {
      const bytes = await thumbnail.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${thumbnail.name}`;
      const filepath = path.join(process.cwd(), "public/uploads", filename);

      await writeFile(filepath, buffer);
      thumbnailPath = `/uploads/${filename}`;

      // ลบ thumbnail เก่า (ถ้ามี)
      if (existingArticle.thumbnail) {
        try {
          const oldPath = path.join(process.cwd(), "public", existingArticle.thumbnail);
          await unlink(oldPath);
        } catch (error) {
          console.log("Old thumbnail not found or cannot delete");
        }
      }
    }

    // สร้าง update data
    const updateData = {
      title,
      slug: newSlug,
      content,
      excerpt: excerpt || null,
      keywords: keywords || null,
      categoryId: parseInt(categoryId),
      status: status || "draft",
      thumbnail: thumbnailPath,
    };

    // จัดการ author type
    if (authorType === "penname") {
      updateData.authorType = "penname";
      updateData.penName = penName?.trim() || null;
      updateData.position = position?.trim() || null;
      updateData.authorId = null;
    } else {
      updateData.authorType = "user";
      updateData.authorId = session.user.id;
      updateData.penName = null;
      updateData.position = null;
    }

    // Reset approval fields ถ้าเปลี่ยนเป็น pending
    if (status === "pending" && existingArticle.status !== "pending") {
      updateData.approvedById = null;
      updateData.approvedAt = null;
      updateData.rejectReason = null;
    }

    // อัพเดทบทความ
    const updatedArticle = await prisma.article.update({
      where: { id: existingArticle.id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Article updated successfully",
      article: updatedArticle,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { success: false, message: "Error updating article" },
      { status: 500 }
    );
  }
}
