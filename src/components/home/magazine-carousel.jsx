"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";

export default function MagazineCarousel({ data }) {
  return (
    <div className="relative w-full overflow-hidden">
      <p className="text-[#F06FAA]">E-BOOK</p>

      <div className="flex justify-between items-end mb-4">
        <h2 className="text-[#101828] text-2xl font-bold">
          SSRU Around
        </h2>

        <a href="/ssru-around" className="hover:underline">
          <div className="text-[#6A7282] flex text-xs items-center gap-1">
            <span>ดูทั้งหมด</span>
            <ArrowRight className="h-3" />
          </div>
        </a>
      </div>

      {/* ================= Mobile + iPad ================= */}
      <div className="xl:hidden w-full">
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
          {data?.map((item, index) => (
            <SwiperSlide key={index} className="h-auto">
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="block h-full"
              >
                <div className="h-full bg-white shadow rounded-xl overflow-hidden hover:shadow-md transition">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[360px] md:h-[360px] object-contain"
                    loading="lazy"
                  />

                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="bg-[#3F458D0D] text-[#3F458D] font-bold text-xs px-2 py-1 rounded-md">
                        {item.issue}
                      </div>

                      <div className="text-xs text-[#99A1AF]">
                        {item.year}
                      </div>
                    </div>

                    <h2 className="font-semibold line-clamp-2">
                      {item.title}
                    </h2>

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

      {/* ================= Desktop ================= */}
      <div className="hidden xl:block w-full overflow-hidden">
        <Swiper
          modules={[Grid]}
          spaceBetween={16}
          slidesPerView={2}
          grid={{
            rows: 2,
            fill: "row",
          }}
          loop={false}
          className="w-full"
        >
          {data?.map((item, index) => (
            <SwiperSlide key={index} className="h-auto">
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="block h-full"
              >
                <div className="h-full bg-white shadow rounded-xl overflow-hidden hover:shadow-md transition">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[360px] object-cover"
                    loading="lazy"
                  />

                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="bg-[#3F458D0D] text-[#3F458D] font-bold text-xs px-2 py-1 rounded-md">
                        {/* {item.issue} */}
                      </div>

                      <div className="text-xs text-[#99A1AF]">
                        {item.year}
                      </div>
                    </div>

                    <h2 className="font-semibold">
                      {item.title}
                    </h2>

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
  );
}
