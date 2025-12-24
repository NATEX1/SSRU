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
    <div className="flex-1">
      <div>
        <p className="text-[#F06FAA]">E-BOOK</p>

        <div className="flex justify-between items-end mb-4">
          <h2 className="text-[#101828] text-4xl font-bold">SSRU Around</h2>

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
            slidesPerView={2}
            loop={false}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
          >
            {data?.map((item, index) => (
              <SwiperSlide key={index} className="px-2">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <div className="carousel-item card bg-white shadow rounded-xl">
                    <figure>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-[360px] object-cover"
                      />
                    </figure>

                    <div className="card-body">
                      <div className="flex justify-between items-start">
                        <div className="bg-[#3F458D0D] text-[#3F458D] font-bold text-xs p-1 rounded-md">
                          {item.issue}
                        </div>
                        <div className="text-xs text-[#99A1AF]">
                          {item.year}
                        </div>
                      </div>

                      <h2 className="card-title">{item.title}</h2>

                      <div className="flex gap-1 items-center text-[#99A1AF] text-sm">
                        <BookOpen className="h-4" />
                        <p>{item.type}</p>
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
