
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name และ Message จำเป็นต้องกรอก" },
        { status: 400 }
      );
    }

    const result = await prisma.comment.create({
      data: {
        name,
        email,
        message
      }
    })

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("API POST /comments ERROR:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}