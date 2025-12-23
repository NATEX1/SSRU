"use client";

import { ArrowRight, BookOpen, Clipboard, Film } from "lucide-react";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ClipCarousel({ data }) {
  return (
    <div className="flex-1 bg-[#F9FAFB] py-16 px-8 rounded-4xl w-full">
      <p className="text-[#F06FAA]">SSRU CHANNEL</p>

      <div className="flex justify-between items-end mb-4">
        <h2 className="text-[#101828] text-4xl font-bold">Short Clips</h2>

        <a href="#" className="hover:underline">
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
        {data?.map((item, index) => (
          <SwiperSlide key={index} className="h-auto">
            <a
              href="https://blog-gray-zeta.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="block h-full"
            >
              <div className="h-full bg-white shadow rounded-xl overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-[200px] w-full object-cover"   
                />

                <div className="p-4 flex flex-col gap-2">

                  <h3 className="font-semibold line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="flex gap-1 items-center text-[#99A1AF] text-sm">
                    <Film className="h-4" /> • {item.views} views
                    
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
