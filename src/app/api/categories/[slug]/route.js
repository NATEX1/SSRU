import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { slug } = await params;

    const category = await prisma.category.findUnique({
      where: {
        slug,
      }
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
      message: "เซิร์ฟเวอร์มีปัญหา",
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { slug } = await params;

    await prisma.category.delete({
      where: {
        slug,
      },
    });

    return NextResponse.json({
      success: true,
      message: "ลบข้อมูลเรียบร้อยแล้ว",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "เซิร์ฟเวอร์มีปัญหา" },
      { status: 500 }
    );
  }
}
