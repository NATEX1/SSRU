"use client";

import { ArrowRight, Film, X } from "lucide-react";
import React, { useState } from "react";
import { getMultilingualContent } from "@/lib/multilingual";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ClipCarousel({ data = [] }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [clips, setClips] = useState(
    [...data].slice(0, 4)
  );

  // Sync props to state
  React.useEffect(() => {
    setClips([...data].slice(0, 4));
  }, [data]);

  const handleClipClick = async (e, item) => {
    if (item.videoUrl) {
      e.preventDefault();
      setSelectedVideo(item);

      // Increment view count in DB
      try {
        const res = await fetch(`/api/short-clips/${item.id}/view`, {
          method: "PATCH",
        });
        const result = await res.json();
        if (result.success) {
          // Update local state
          setClips((prev) =>
            prev.map((c) =>
              c.id === item.id ? { ...c, viewCount: result.data.viewCount } : c
            )
          );
        }
      } catch (error) {
        console.error("Error incrementing view:", error);
      }
    }
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  const formatViews = (count) => {
    if (!count) return 0;
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "k";
    }
    return count;
  };

  return (
    <div className="flex-1">
      <p className="text-[#F06FAA]">SSRU CHANNEL</p>

      <div className="flex justify-between items-end mb-4">
        <h2 className="text-[#101828] text-2xl font-bold">Short Clips</h2>

        <a
          href="/short-clips"
          className="hover:underline"
        >
          <div className="text-[#6A7282] flex text-xs items-center gap-1">
            <span>ดูทั้งหมด</span>
            <ArrowRight className="h-3" />
          </div>
        </a>
      </div>

      {/* Mobile + iPad */}
      <div className="xl:hidden">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          className="w-full !pb-8"
          breakpoints={{
            0: {
              slidesPerView: 1.15,
              spaceBetween: 12,
            },
            640: {
              slidesPerView: 1.4,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
          }}
        >
          {clips.map((item) => (
            <SwiperSlide key={item.id} className="h-auto">
              <a
                href={item.youtubeUrl || item.videoUrl || "#"}
                target={item.youtubeUrl ? "_blank" : "_self"}
                rel="noreferrer"
                className="block h-full"
                onClick={(e) => handleClipClick(e, item)}
              >
                <div className="h-full bg-white shadow rounded-xl overflow-hidden hover:shadow-md transition">
                  <img
                    src={
                      item.thumbnailUrl ||
                      (item.youtubeId
                        ? `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`
                        : "")
                    }
                    alt={getMultilingualContent(item, "title")}
                    className="w-full object-contain h-[360px] md:h-[360px]"
                    loading="lazy"
                  />

                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="font-semibold line-clamp-2">
                      {getMultilingualContent(item, "title")}
                    </h3>

                    <div className="flex gap-1 items-center text-[#99A1AF] text-sm">
                      <Film className="h-4" />
                      <span>• {formatViews(item.viewCount)} views</span>
                    </div>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop: keep original grid */}
      <div className="hidden xl:block">
        <Swiper
          modules={[Grid, Navigation]}
          spaceBetween={16}
          slidesPerView={2}
          grid={{ rows: 2, fill: "row" }}
          navigation
          className="w-full"
        >
          {clips.map((item) => (
            <SwiperSlide key={item.id} className="h-auto">
              <a
                href={item.youtubeUrl || item.videoUrl || "#"}
                target={item.youtubeUrl ? "_blank" : "_self"}
                rel="noreferrer"
                className="block h-full"
                onClick={(e) => handleClipClick(e, item)}
              >
                <div className="h-full bg-white shadow rounded-xl overflow-hidden hover:shadow-md transition">
                  <img
                    src={
                      item.thumbnailUrl ||
                      (item.youtubeId
                        ? `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`
                        : "")
                    }
                    alt={getMultilingualContent(item, "title")}
                    className="h-[150px] w-full object-cover"
                    loading="lazy"
                  />

                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="font-semibold line-clamp-2">
                      {getMultilingualContent(item, "title")}
                    </h3>

                    <div className="flex gap-1 items-center text-[#99A1AF] text-sm">
                      <Film className="h-4" />
                      <span>• {formatViews(item.viewCount)} views</span>
                    </div>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={closeVideo}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="aspect-video bg-black flex items-center justify-center">
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>

            <div className="p-4 bg-[#101828] text-white">
              <h3 className="text-xl font-bold">{getMultilingualContent(selectedVideo, "title")}</h3>
              <div className="mt-2 flex gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Film className="w-4 h-4" />
                  <span>{selectedVideo.viewCount} views</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={closeVideo} />
        </div>
      )}
    </div>
  );
}
