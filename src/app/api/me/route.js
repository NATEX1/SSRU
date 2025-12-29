import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json({ message: "ไม่ได้รับอนุญาต" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "เซิฟเวอร์มีปัญหา",
    });
  }
}
