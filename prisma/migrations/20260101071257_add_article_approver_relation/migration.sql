/*
  Warnings:

  - You are about to drop the column `approvedAt` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `approvedById` on the `articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "articles" DROP COLUMN "approvedAt",
DROP COLUMN "approvedById",
ADD COLUMN     "approved_at" TIMESTAMP(3),
ADD COLUMN     "approved_by_id" INTEGER,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
