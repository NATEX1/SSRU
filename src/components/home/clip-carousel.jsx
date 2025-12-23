"use client";

import { ArrowRight, Film } from "lucide-react";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";

const shortClips = [
  {
    id: "jUbjexT277U",
    title: "จากก้าวเล็กๆ สู่ก้าวที่สำคัญ ✨#ssru #สวนสุนันทา #สมัครเรียน  #tcas69 #บัณฑิตสวนสุนันทา #ลูกพระนาง",
    views: "2.7k",
    url: "https://youtube.com/shorts/jUbjexT277U?si=F7FL0Wage-eN0RGV",
  },
  {
    id: "AuLCDUoX0YY",
    title: "30 กันยายน 2568 #ssru #สวนสุนันทา #ลูกพระนาง",
    views: "150",
    url: "https://youtube.com/shorts/AuLCDUoX0YY?si=8kRF_5SWLoD1A5yt",
  },
  {
    id: "mqeRpF0eHJo",
    title: "#รับปริญญา #ssru #ลูกพระนาง",
    views: "314",
    url: "https://youtube.com/shorts/mqeRpF0eHJo?si=TTUjJHOwLMsG4ltN",
  },
  {
    id: "zzzAumXytjE",
    title: "#สวนสุนันทา #ลูกพระนาง #รับปริญญา",
    views: "257",
    url: "https://youtube.com/shorts/zzzAumXytjE?si=bCJKXBcSE1BJdPOD",
  },
];

export default function ClipCarousel() {
  return (
    <div className="flex-1">
      <p className="text-[#F06FAA]">SSRU CHANNEL</p>

      <div className="flex justify-between items-end mb-4">
        <h2 className="text-[#101828] text-4xl font-bold">Short Clips</h2>

        <a
          href="https://www.youtube.com/@ssrutube/shorts"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          <div className="text-[#6A7282] flex text-xs items-center gap-1">
            <span>ดูทั้งหมด</span>
            <ArrowRight className="h-3" />
          </div>
        </a>
      </div>

      <Swiper
        modules={[Grid, Navigation]}
        spaceBetween={16}
        slidesPerView={2}
        grid={{
          rows: 2,
          fill: "row",
        }}
        className="w-full"
      >
        {shortClips.map((item) => (
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
                  className="h-[200px] w-full object-cover"
                />

                <div className="p-4 flex flex-col gap-2">
                  <h3 className="font-semibold line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="flex gap-1 items-center text-[#99A1AF] text-sm">
                    <Film className="h-4" />
                    <span>• {item.views} views</span>
                  </div>
                </div>
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
