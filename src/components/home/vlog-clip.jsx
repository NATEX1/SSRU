"use client";

import { ArrowRight, Film } from "lucide-react";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const vlogClips = [
  {
    id: "ex_lpnQY_jE",
    title:
      "“การสร้างคนคือหัวใจการพัฒนางาน” #วารสารแก้วเจ้าจอมออนไลน์ #มืออาชีพ #ssru #การศึกษา #ราชภัฏ",
    viewCount: "896",
    url: "https://youtube.com/shorts/ex_lpnQY_jE?si=yVwRd-rn8sAbpzVn",
  },
  {
    id: "qqBm0GBcTgs",
    title:
      "“เป็นผู้นำต้องมีความพราว สง่างาม”รศ.พล.ต.ท.ดร.สัณฐาน ชยนนท์ สัมภาษณ์ #วารสารแก้วเจ้าจอมออนไลน์ #ssru",
    viewCount: "405",
    url: "https://youtube.com/shorts/qqBm0GBcTgs?si=CsMAu_DscxcCjEEJ",
  },
];

export default function VlogCarousel({
  data = vlogClips,
  playlistUrl = "/vlog", 
}) {
  const items = (data || []).slice(0, 2);

  return (
    <div className="flex-1">
      <p className="text-[#F06FAA]">SSRU CHANNEL</p>

      <div className="flex justify-between items-end mb-4">
        <h2 className="text-[#101828] text-2xl font-bold">Vlog</h2>

        <a
          href={playlistUrl}
          target={playlistUrl?.startsWith("http") ? "_blank" : undefined}
          rel={playlistUrl?.startsWith("http") ? "noreferrer" : undefined}
          className="hover:underline"
        >
          <div className="text-[#6A7282] flex text-xs items-center gap-1">
            <span>ดูทั้งหมด</span>
            <ArrowRight className="h-3" />
          </div>
        </a>
      </div>

      {/* ================= Mobile + iPad (เหมือน Short Clips) ================= */}
      <div className="xl:hidden">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          className="w-full !pb-8"
          breakpoints={{
            0: { slidesPerView: 1.15, spaceBetween: 12 },
            640: { slidesPerView: 1.4, spaceBetween: 12 },
            768: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 2, spaceBetween: 20 },
          }}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id} className="h-auto">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="block h-full"
              >
                <div className="h-full bg-white shadow rounded-xl overflow-hidden hover:shadow-md transition">
                  <img
                    src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`}
                    alt={item.title}
                    className="w-full object-contain h-[360px] md:h-[360px]"
                    loading="lazy"
                  />

                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="font-semibold line-clamp-2">{item.title}</h3>

                    <div className="flex gap-1 items-center text-[#99A1AF] text-sm">
                      <Film className="h-4" />
                      <span>• {item.viewCount} views</span>
                    </div>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ================= Desktop (XL): แค่ 2 คลิป (1 แถว) ================= */}
      <div className="hidden xl:block">
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="block h-full"
            >
              <div className="h-full bg-white shadow rounded-xl overflow-hidden hover:shadow-md transition">
                {/* ตั้ง h รูปให้เท่ากับ Short Clips desktop card */}
                <img
                  src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`}
                  alt={item.title}
                  className="h-[200px] w-full object-cover"
                  loading="lazy"
                />

                <div className="p-4 flex flex-col gap-2">
                  <h3 className="font-semibold line-clamp-2">{item.title}</h3>

                  <div className="flex gap-1 items-center text-[#99A1AF] text-sm">
                    <Film className="h-4" />
                    <span>• {item.viewCount} views</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
