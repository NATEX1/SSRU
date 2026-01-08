/*
  Warnings:

  - You are about to drop the column `views` on the `articles` table. All the data in the column will be lost.
  - The primary key for the `short_clips` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `short_clips` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "articles" DROP COLUMN "views",
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "short_clips" DROP CONSTRAINT "short_clips_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "short_clips_pkey" PRIMARY KEY ("id");
