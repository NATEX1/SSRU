const { PrismaClient } = require("./src/generated/prisma/client");
const prisma = new PrismaClient();

async function main() {
    try {
        const articles = await prisma.article.findMany({
            where: { status: { not: "draft" } }
        });
        console.log("Non-draft articles count:", articles.length);
        articles.forEach(a => {
            console.log(`ID: ${a.id}, Status: ${a.status}, Created: ${a.createdAt}, Approved: ${a.approvedAt}, Rejected: ${a.rejectedAt}`);
        });
    } catch (err) {
        console.error("Prisma query failed:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
