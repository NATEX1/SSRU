import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { comment } = await req.json();

    if (!comment?.trim()) {
      return NextResponse.json({ message: "กรุณาระบุเหตุผล" }, { status: 400 });
    }

    // console.log(session.user);


    await prisma.article.update({
      where: { id: Number(id) },
      data: {
        status: "rejected",
        rejectReason: comment,
        approvedById: Number(session.user.id),
        rejectedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: 'ไม่อนุมัติ' });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    })
  }
}
