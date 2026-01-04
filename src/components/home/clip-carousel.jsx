"use client";

import { ArrowRight, Film } from "lucide-react";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";

const shortClips = [
  {
    id: "a9ml5nZen5Y",
    title:
      "“จากการเปลี่ยนผ่านผู้นำ สู่บทบาทอธิการบดีหญิง” รศ.ดร.ชุติกาญจน์ ศรีวิบูลย์ #ssru",
    views: "896",
    url: "https://youtube.com/shorts/a9ml5nZen5Y?si=_fzaQAMa57RggcHB",
  },
  {
    id: "qqBm0GBcTgs",
    title: "“ เป็นผู้นำต้องมีความพราว สง่างาม” รศ.พล.ต.ท.ดร.สัณฐาน ชยนนท์ #ssru",
    views: "405",
    url: "https://youtube.com/shorts/qqBm0GBcTgs?si=Mf5tpNuescDAAYUE",
  },
  {
    id: "V5TMKwpSbkc",
    title: "“ ยิงปืนนัดเดียวได้นก 2 ตัว” ผศ.ดร. วนิดา วอนสวัสดิ์ #ssru",
    views: "1.3k",
    url: "https://youtube.com/shorts/V5TMKwpSbkc?si=oOBCovxDNDmoFvaa",
  },
  {
    id: "Wwih-fmMAIM",
    title: "“เส้นทางไม่ง่าย แต่ท้อไม่เป็น” น้องไป๋ เนาวรัตน์ แซ่ย่าง #นักกีฬาวูซูทีมชาติ #ssru #วูซู",
    views: "1.7k",
    url: "https://youtube.com/shorts/Wwih-fmMAIM?si=IbPOVAHgynq7EF_4",
  },
];

export default function ClipCarousel() {
  return (
    <div className="flex-1">
      <p className="text-[#F06FAA]">SSRU CHANNEL</p>

      <div className="flex justify-between items-end mb-4">
        <h2 className="text-[#101828] text-2xl font-bold">Short Clips</h2>

        <a
          href="https://www.youtube.com/playlist?list=PL9rBdn9yFjyvkR2D4qZIc5A1_or_CT_XL"
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

      {/* Mobile: slide (1 row) */}
      <div className="xl:hidden">
        <Swiper
          modules={[Pagination]}
          spaceBetween={12}
          slidesPerView={1.15}
          pagination={{ clickable: true }}
          className="w-full !pb-8"
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
                    className="xl:h-[300px] w-full object-cover"
                    loading="lazy"
                  />

                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="font-semibold line-clamp-2">{item.title}</h3>

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

      {/* Desktop: keep original grid */}
      <div className="hidden xl:block">
        <Swiper
          modules={[Grid, Navigation]}
          spaceBetween={16}
          slidesPerView={2}
          grid={{
            rows: 2,
            fill: "row",
          }}
          navigation
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
                    loading="lazy"
                  />

                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="font-semibold line-clamp-2">{item.title}</h3>

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
    </div>
  );
}
