"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";

export default function MagazineCarousel({ data }) {
  return (
    <div className="relative overflow-hidden w-full">
      <p className="text-[#F06FAA]">E-BOOK</p>

      <div className="flex justify-between items-end mb-4">
        <h2 className="text-[#101828] text-2xl font-bold">SSRU Around</h2>

        <a href="/ssru-around" className="hover:underline">
          <div className="text-[#6A7282] flex text-xs items-center gap-1">
            <span>ดูทั้งหมด</span>
            <ArrowRight className="h-3" />
          </div>
        </a>
      </div>

      {/* ================= Mobile ================= */}
      <div className="xl:hidden w-full">
        <Swiper
          modules={[Pagination]}
          spaceBetween={12}
          slidesPerView={1.15}
          pagination={{ clickable: true }}
          className="w-full !pb-8"
        >
          {data?.map((item, index) => (
            <SwiperSlide key={index} className="px-2">
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <div className="bg-white shadow rounded-xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="xl:h-[260px] w-full object-cover"
                    loading="lazy"
                  />

                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="bg-[#3F458D0D] text-[#3F458D] font-bold text-xs p-1 rounded-md">
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
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 2 },
          }}
          loop={false}
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
                      className="h-[300px] w-full object-cover"
                      loading="lazy"
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
  );
}
