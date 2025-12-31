-- CreateEnum
CREATE TYPE "AuthorType" AS ENUM ('user', 'penname');

-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_author_id_fkey";

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "author_type" "AuthorType" NOT NULL DEFAULT 'user',
ADD COLUMN     "pen_name" TEXT,
ALTER COLUMN "author_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
