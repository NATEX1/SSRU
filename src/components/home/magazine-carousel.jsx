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
      <div>
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

        <div className="w-full overflow-hidden">
          <Swiper
            modules={[Grid]}
            loop={false}
            spaceBetween={16}
            breakpoints={{
              0: { slidesPerView: 1.15 },
              480: { slidesPerView: 1.5 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {data?.map((item, index) => (
              <SwiperSlide key={index} className="px-1 sm:px-2">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full h-full"
                >
                  <div className="w-full h-full bg-white shadow rounded-xl overflow-hidden flex flex-col">
                    <figure className="w-full">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-[260px] sm:h-[300px] lg:h-[340px] object-cover"
                        loading="lazy"
                      />
                    </figure>

                    <div className="p-4 sm:p-5 flex-1 flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-3">
                        <div className="bg-[#3F458D0D] text-[#3F458D] font-bold text-xs px-2 py-1 rounded-md whitespace-nowrap">
                          {item.issue}
                        </div>
                        <div className="text-xs text-[#99A1AF] whitespace-nowrap">
                          {item.year}
                        </div>
                      </div>

                      <h3 className="text-[#101828] font-bold text-base sm:text-lg leading-snug line-clamp-2">
                        {item.title}
                      </h3>

                      <div className="mt-auto flex gap-1 items-center text-[#99A1AF] text-sm">
                        <BookOpen className="h-4" />
                        <p className="line-clamp-1">{item.type}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>


        </div>
      </div>
    </div>

  );
}
