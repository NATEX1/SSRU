/*
  Warnings:

  - The `status` column on the `articles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `author_type` column on the `articles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `SiteSetting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SocialLink` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('admin', 'approver', 'author');

-- CreateEnum
CREATE TYPE "article_status" AS ENUM ('draft', 'approved', 'rejected', 'pending');

-- CreateEnum
CREATE TYPE "article_type" AS ENUM ('user', 'penname');

-- CreateEnum
CREATE TYPE "clip_type" AS ENUM ('upload', 'youtube');

-- DropForeignKey
ALTER TABLE "SocialLink" DROP CONSTRAINT "SocialLink_site_id_fkey";

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "status",
ADD COLUMN     "status" "article_status" NOT NULL DEFAULT 'draft',
DROP COLUMN "author_type",
ADD COLUMN     "author_type" "article_type" NOT NULL DEFAULT 'user';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "user_role" NOT NULL DEFAULT 'author',
DROP COLUMN "status",
ADD COLUMN     "status" "user_status" NOT NULL DEFAULT 'active';

-- DropTable
DROP TABLE "SiteSetting";

-- DropTable
DROP TABLE "SocialLink";

-- DropEnum
DROP TYPE "ArticleStatus";

-- DropEnum
DROP TYPE "AuthorType";

-- DropEnum
DROP TYPE "ClipType";

-- DropEnum
DROP TYPE "UserRole";

-- DropEnum
DROP TYPE "UserStatus";

-- CreateTable
CREATE TABLE "site_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "footer_text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_links" (
    "id" SERIAL NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "site_id" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "site_settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
