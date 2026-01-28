import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

let prisma;

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
})

// Next.js Dev Mode: ใช้ global object เพื่อไม่ให้สร้างหลาย instance
if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient({ adapter });
} else {
    // ใน Dev Mode ให้ใช้ global เพื่อป้องกันการสร้าง instance ซ้ำซ้อน
    if (!global.prisma) {
        global.prisma = new PrismaClient({ adapter });
    }
    prisma = global.prisma;
}

// Refresh tag: 1
export default prisma;