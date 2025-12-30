"use client";

import { useResponsive } from "@/hooks/use-responsive";
import { ArrowRight, BookOpen } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Grid } from "swiper/modules";

export default function MagazineCarousel({ data }) {
  return (
    <div className="relative overflow-hidden rounded-2xl w-full">
      <p className="text-[#F06FAA]">E-BOOK</p>

      <div className="flex justify-between items-end mb-4">
        <h2 className="text-[#101828] text-xl font-bold">SSRU Around</h2>

        <a href="#" className="hover:underline">
          <div className="text-[#6A7282] flex text-xs items-center gap-1">
            <span>ดูทั้งหมด</span>
            <ArrowRight className="h-3" />
          </div>
        </a>
      </div>

      <Swiper
          modules={[Pagination]}
          spaceBetween={12}
          loop={false}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1.1,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
        >

        {data?.map((item, index) => (
          <SwiperSlide key={index}>
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="block h-full"
            >
              <div className="bg-white shadow rounded-xl overflow-hidden h-full flex flex-col">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[260px] sm:h-[300px] lg:h-[340px]"
                />

                <div className="p-4 flex-1 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="bg-[#3F458D0D] text-[#3F458D] font-bold text-xs px-2 py-1 rounded">
                      {item.issue}
                    </span>
                    <span className="text-xs text-[#99A1AF]">
                      {item.year}
                    </span>
                  </div>

                  <h3 className="font-bold text-[#101828] text-base line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="mt-auto flex items-center gap-1 text-sm text-[#99A1AF]">
                    <BookOpen className="h-4" />
                    <span>{item.type}</span>
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
