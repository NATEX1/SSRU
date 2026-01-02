/*
  Warnings:

  - You are about to drop the column `shareCount` on the `articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "articles" DROP COLUMN "shareCount",
ADD COLUMN     "share_count" INTEGER NOT NULL DEFAULT 0;
