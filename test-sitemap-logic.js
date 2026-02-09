
const { PrismaClient } = require("./src/generated/prisma/client");
const prisma = new PrismaClient();

async function testSitemap() {
    try {
        console.log("Fetching articles...");
        const articles = await prisma.article.findMany({
            where: { status: "approved" },
            select: { id: true, updatedAt: true },
        });
        console.log(`Found ${articles.length} articles.`);

        console.log("Fetching categories...");
        const categories = await prisma.category.findMany({
            select: { slug: true },
        });
        console.log(`Found ${categories.length} categories.`);

        console.log("Fetching clips...");
        const clips = await prisma.shortClip.findMany({
            select: { id: true, updatedAt: true },
        });
        console.log(`Found ${clips.length} clips.`);

        console.log("Test completed successfully.");
    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testSitemap();
