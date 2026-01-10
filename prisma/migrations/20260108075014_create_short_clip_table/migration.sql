-- CreateTable
CREATE TABLE "short_clips" (
    "id" SERIAL NOT NULL,
    "title_th" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_cn" TEXT NOT NULL,
    "video_url" TEXT,
    "thumbnail_url" TEXT,
    "youtube_url" TEXT,
    "youtube_id" TEXT,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "short_clips_pkey" PRIMARY KEY ("id")
);
