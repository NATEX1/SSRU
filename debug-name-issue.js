const { PrismaClient } = require("./src/generated/prisma/client");
const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.article.findMany({
    take: 5,
    include: { author: true }
  });
  console.log(JSON.stringify(articles.map(a => ({
    id: a.id,
    authorType: a.authorType,
    authorName: a.author?.name,
    penNameTh: a.penNameTh,
    penName: a.penName,
    titleTh: a.titleTh
  })), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
