-- AlterEnum
ALTER TYPE "ArticleStatus" ADD VALUE 'pending';

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" INTEGER,
ADD COLUMN     "reject_reason" TEXT;
