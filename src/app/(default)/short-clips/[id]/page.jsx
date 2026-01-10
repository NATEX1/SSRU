import prisma from "@/lib/prisma";
import React from "react";

export default async function page({ params }) {
  const { id } = await params;
  const clip = await prisma.shortClip.findUnique({ where: { id: Number(id) } });

  if (!clip) {
    return <div>ไม่พบวิดีโอ</div>;
  }
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-4">
      <h1 className="text-2xl font-bold">{clip.titleTh}</h1>

      <div className="aspect-video bg-black rounded overflow-hidden">
        {clip.youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${clip.youtubeId}`}
            title={clip.titleTh}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : clip.videoUrl ? (
          <video
            src={clip.videoUrl}
            controls
            playsInline
            className="w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            ไม่มีไฟล์วิดีโอ
          </div>
        )}
      </div>
    </div>
  );
}
