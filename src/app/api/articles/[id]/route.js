import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import path from "path";

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
    const { id } = await params;

    const article = await prisma.article.findUnique({
      where: {
        id: Number(id),
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
            name: true,
          },
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

    const { id } = await params;

    const existingArticle = await prisma.article.findUnique({
      where: { id: Number(id) },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    const isAuthor = Number(existingArticle.authorId) === Number(session.user.id);
    const isAdmin = session.user.role === "admin";
    const isApprover = session.user.role === "approver";

    if (!isAuthor && !isAdmin && !isApprover) {
      return NextResponse.json(
        { success: false, message: "Forbidden: You don't have permission to edit this article" },
        { status: 403 }
      );
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

    // Validation
    if (!(titleTh && contentTh) && !(titleEn && contentEn) && !(titleCn && contentCn)) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอกข้อมูลครบอย่างน้อย 1 ภาษา (หัวข้อและเนื้อหา)" },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json({ success: false, message: "กรุณาเลือกหมวดหมู่" }, { status: 400 });
    }

    // Handle thumbnails
    const handleUpload = async (fileKey, existingPath) => {
      const file = formData.get(fileKey);
      if (file && file.size > 0 && file.arrayBuffer) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${fileKey}-${file.name}`;
        const filePath = path.join(process.cwd(), "public", "uploads", fileName);
        await writeFile(filePath, buffer);
        return "/uploads/" + fileName;
      }
      return existingPath;
    };

    const thumbnailTh = await handleUpload("thumbnailTh", existingArticle.thumbnailTh);
    const thumbnailEn = await handleUpload("thumbnailEn", existingArticle.thumbnailEn);
    const thumbnailCn = await handleUpload("thumbnailCn", existingArticle.thumbnailCn);

    const updateData = {
      categoryId,
      status,
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

      compilerPositionTh: (authorType === "penname" && isCompiled) ? compilerPositionTh : null,
      compilerPositionEn: (authorType === "penname" && isCompiled) ? compilerPositionEn : null,
      compilerPositionCn: (authorType === "penname" && isCompiled) ? compilerPositionCn : null,
    };

    // Reset approval fields if switching to pending
    if (status === "pending" && existingArticle.status !== "pending") {
      updateData.approvedById = null;
      updateData.approvedAt = null;
      updateData.rejectReason = null;
    }

    const updatedArticle = await prisma.article.update({
      where: { id: existingArticle.id },
      data: updateData,
      include: {
        author: { select: { id: true, name: true, email: true } },
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

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Invalid article id" },
        { status: 400 }
      );
    }

    await prisma.article.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json(
      { success: true, message: "Article deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to delete article" },
      { status: 500 }
    );
  }
}
