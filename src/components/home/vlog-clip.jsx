"use client";

import { ArrowRight, Film } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { getMultilingualContent } from "@/lib/multilingual";

export default function VlogCarousel({ data = [] }) {
  const [items, setItems] = useState(data || []);

  useEffect(() => {
    setItems(data || []);
  }, [data]);

  // Client-side metadata fetching fallback
  useEffect(() => {
    items.forEach(async (item, index) => {
      if (item.youtubeId && (!item.viewCount || item.viewCount === 0)) {
        try {
          const res = await fetch(`https://www.youtube.com/watch?v=${item.youtubeId}`);
          const html = await res.text();

          let viewCount = null;
          let publishedAt = null;

          const viewMatch = html.match(/"viewCount":"(\d+)"/);
          if (viewMatch) viewCount = parseInt(viewMatch[1]);
          else {
            const labelMatch = html.match(/"label":"([\d,]+) views"/);
            if (labelMatch) viewCount = parseInt(labelMatch[1].replace(/,/g, ""));
          }

          const dateMatch = html.match(/"uploadDate":"([^"]+)"/);
          if (dateMatch) publishedAt = dateMatch[1];

          if (viewCount || publishedAt) {
            setItems(prev => {
              const newItems = [...prev];
              newItems[index] = {
                ...newItems[index],
                viewCount: viewCount || newItems[index].viewCount,
                publishedAt: publishedAt || newItems[index].publishedAt
              };
              return newItems;
            });
          }
        } catch (error) {
          console.error("Client fallback fetch error:", error);
        }
      }
    });
  }, [items.length]);

  return (
    <div className="bg-[#F9FAFB] border border-[#F3F4F6] p-6 rounded-2xl shadow mb-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-start gap-3">
            <div className="w-2 h-7 rounded-full bg-[#F06FAA]" />
            <h4 className="text-xl md:text-2xl font-bold text-[#101828] leading-tight">
              SSRU Vlog
            </h4>
          </div>
          <a
            // href="/vlog"
            href="https://www.youtube.com/playlist?list=PL9rBdn9yFjyvkR2D4qZIc5A1_or_CT_XL"
            className="hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            <div className="text-[#6A7282] flex text-xs items-center gap-1">
              <span>ดูทั้งหมด</span>
              <ArrowRight className="h-3" />
            </div>
          </a>
        </div>

        {/* ================= Mobile + iPad (Swiper) ================= */}
        <div className="xl:hidden">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            className="w-full !pb-8"
            breakpoints={{
              0: { slidesPerView: 1.15, spaceBetween: 12 },
              640: { slidesPerView: 1.4, spaceBetween: 12 },
              768: { slidesPerView: 2, spaceBetween: 16 },
            }}
          >
            {items.map((item) => (
              <SwiperSlide key={item.id} className="h-auto">
                <a
                  href={item.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block h-full"
                >
                  <div className="h-full bg-white shadow rounded-xl overflow-hidden hover:shadow-md transition flex flex-col">
                    <div className="w-full bg-[#101828] flex items-center justify-center h-[360px]">
                      <img
                        src={item.youtubeId ? `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg` : "https://img.youtube.com/vi/placeholder/hqdefault.jpg"}
                        alt={getMultilingualContent(item, "title")}
                        className="max-w-full max-h-full object-contain"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "https://img.youtube.com/vi/placeholder/hqdefault.jpg";
                        }}
                      />
                    </div>

                    <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                      <h3 className="font-semibold line-clamp-2 text-sm md:text-base">{getMultilingualContent(item, "title")}</h3>
                      <div className="flex justify-between items-center text-[#99A1AF] text-[10px] md:text-xs">
                        <div className="flex gap-1 items-center">
                          <Film className="h-3" />
                          <span>• {(item.viewCount || 0).toLocaleString()} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ================= Desktop (Grid) ================= */}
        <div className="hidden xl:block">
          <div className="grid grid-cols-2 gap-6">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="block group"
              >
                <div className="bg-white shadow rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col md:flex-row h-full border border-gray-100">
                  <div className="w-full md:w-2/5 shrink-0 overflow-hidden relative bg-[#101828] flex items-center justify-center min-h-[200px]">
                    <img
                      src={item.youtubeId ? `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg` : "https://img.youtube.com/vi/placeholder/hqdefault.jpg"}
                      alt={getMultilingualContent(item, "title")}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://img.youtube.com/vi/placeholder/hqdefault.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-[#F06FAA] transition-colors leading-tight">
                        {getMultilingualContent(item, "title")}
                      </h3>
                      <div className="flex flex-col gap-1 mt-2">
                        <p className="text-xs text-[#99A1AF] font-medium line-clamp-1">
                          {item.titleEn && <span className="mr-2">EN: {item.titleEn}</span>}
                          {item.titleCn && <span>CN: {item.titleCn}</span>}
                        </p>

                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-2 items-center text-[#99A1AF] text-sm">
                        <div className="bg-gray-100 p-1.5 rounded-full">
                          <Film className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-medium">{(item.viewCount || 0).toLocaleString()} views</span>
                      </div>
                      <span className="text-[#3F458D] text-xs font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                        ชมวิดีโอ <ArrowRight className="ml-1 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

