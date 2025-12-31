import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function DELETE(request, { params }) {
    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId);

        if (isNaN(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid ID format" },
                { status: 400 }
            );
        }

        const deletedUser = await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "ลบผู้ใช้สำเร็จ",
            deletedUser,
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { success: false, message: "เกิดข้อผิดพลาดในการลบผู้ใช้" },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId);

        if (isNaN(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid ID" },
                { status: 400 }
            );
        }

        const { name, email, role, position, status, password } = await req.json();

        // Check if email is already taken by another user
        if (email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email,
                    NOT: {
                        id, // Exclude current user
                    },
                },
            });

            if (existingUser) {
                return NextResponse.json(
                    { success: false, message: "อีเมลนี้มีผู้ใช้งานแล้ว" },
                    { status: 400 }
                );
            }
        }

        const updateData = {
            name,
            email,
            role,
            position,
            status,
        };

        // Only update password if provided
        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({
            success: true,
            message: "อัปเดตข้อมูลสำเร็จ",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { success: false, message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" },
            { status: 500 }
        );
    }
}
