const { PrismaClient } = require("./src/generated/prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.article.findMany({
    take: 5,
    include: { author: true }
  });
  const data = articles.map(a => ({
    id: a.id,
    authorType: a.authorType,
    authorName: a.author?.name,
    penNameTh: a.penNameTh,
    penName: a.penName,
    titleTh: a.titleTh
  }));
  fs.writeFileSync("name-debug.json", JSON.stringify(data, null, 2));
  console.log("Debug data written to name-debug.json");
}

main().catch(console.error).finally(() => prisma.$disconnect());
