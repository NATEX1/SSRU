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
    // @ts-ignore
    if (!global.prisma) {
        // ใส่ {} เป็น PrismaClientOptions ว่าง
        global.prisma = new PrismaClient({ adapter });
    }
    // @ts-ignore
    prisma = global.prisma;
}

export default prisma;