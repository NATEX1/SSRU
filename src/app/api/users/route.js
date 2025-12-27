import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { count, like, or, eq, and, not } from "drizzle-orm";

export async function POST(req) {
  try {
    // const session = await getServerSession(authOptions)

    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role: role || "author",
    });

    return NextResponse.json(
      { message: "User created" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        message: "Error creating user",
        error: err.message,
        code: err.code,
      },
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

    const q = searchParams.get("q");
    const role = searchParams.get("role");

    const conditions = [
      not(eq(users.role, "admin")), 
    ];

    if (q) {
      conditions.push(
        or(
          like(users.name, `%${q}%`),
          like(users.email, `%${q}%`)
        )
      );
    }

    if (role) {
      conditions.push(eq(users.role, role));
    }

    const whereClause = and(...conditions);

    const data = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
        position: users.position,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    const [{ count: total }] = await db
      .select({ count: count() })
      .from(users)
      .where(whereClause);

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users", error: err.message },
      { status: 500 }
    );
  }
}



