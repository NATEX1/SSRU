const { PrismaClient } = require("./src/generated/prisma/client");
const prisma = new PrismaClient();

async function main() {
    const articles = await prisma.article.findMany({
        where: { status: "approved" },
        orderBy: { publishedAt: "desc" },
        take: 5,
        select: { id: true, titleTh: true, publishedAt: true }
    });

    console.log("Current Server Time (UTC):", new Date().toISOString());
    console.log("-----------------------------------------");
    articles.forEach(a => {
        console.log(`ID: ${a.id}`);
        console.log(`Title: ${a.titleTh}`);
        console.log(`PublishedAt (DB): ${a.publishedAt ? a.publishedAt.toISOString() : "null"}`);
        console.log("-----------------------------------------");
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
