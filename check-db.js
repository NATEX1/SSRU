const { PrismaClient } = require('./src/generated/prisma/client');
require('dotenv').config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);
const prisma = new PrismaClient();

async function main() {
    try {
        const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'site_settings';
    `;
        console.log("Columns in site_settings:", result);
    } catch (error) {
        console.error("Error inspecting columns:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
