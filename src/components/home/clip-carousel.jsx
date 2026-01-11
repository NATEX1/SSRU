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
  // {
  //   id: "a9ml5nZen5Y",
  //   title:
  //     "“จากการเปลี่ยนผ่านผู้นำ สู่บทบาทอธิการบดีหญิง” รศ.ดร.ชุติกาญจน์ ศรีวิบูลย์ #ssru",
  //   viewCount: "896",
  //   url: "https://youtube.com/shorts/a9ml5nZen5Y?si=_fzaQAMa57RggcHB",
  // },
  // {
  //   id: "qqBm0GBcTgs",
  //   title: "“ เป็นผู้นำต้องมีความพราว สง่างาม” รศ.พล.ต.ท.ดร.สัณฐาน ชยนนท์ #ssru",
  //   viewCount: "405",
  //   url: "https://youtube.com/shorts/qqBm0GBcTgs?si=Mf5tpNuescDAAYUE",
  // },
  // {
  //   id: "V5TMKwpSbkc",
  //   title: "“ ยิงปืนนัดเดียวได้นก 2 ตัว” ผศ.ดร. วนิดา วอนสวัสดิ์ #ssru",
  //   viewCount: "1.3k",
  //   url: "https://youtube.com/shorts/V5TMKwpSbkc?si=oOBCovxDNDmoFvaa",
  // },
  // {
  //   id: "ex_lpnQY_jE",
  //   title:
  //     "“การสร้างคนคือหัวใจการพัฒนางาน” #วารสารแก้วเจ้าจอมออนไลน์ #มืออาชีพ #ssru #การศึกษา #ราชภัฏ",
  //   viewCount: "896",
  //   url: "https://youtube.com/shorts/ex_lpnQY_jE?si=yVwRd-rn8sAbpzVn",
  // },
  // {
  //   id: "qqBm0GBcTgs",
  //   title: "“เป็นผู้นำต้องมีความพราว สง่างาม”รศ.พล.ต.ท.ดร.สัณฐาน ชยนนท์ สัมภาษณ์ #วารสารแก้วเจ้าจอมออนไลน์ #ssru",
  //   viewCount: "405",
  //   url: "https://youtube.com/shorts/qqBm0GBcTgs?si=CsMAu_DscxcCjEEJ",
  // },
  // {
  //   id: "XFCiLXMzpV0",
  //   title: "บทสัมภาษณ์ | #วารสารแก้วเจ้าจอมออนไลน์ #วิจัย #ssru #การศึกษา #ราชภัฏ",
  //   viewCount: "200",
  //   url: "https://youtube.com/shorts/XFCiLXMzpV0?si=9u0_nX2y7FumB9tP",
  // },
  // {
  //   id: "Wwih-fmMAIM",
  //   title: "“เส้นทางไม่ง่าย แต่ท้อไม่เป็น” น้องไป๋ เนาวรัตน์ แซ่ย่าง #นักกีฬาวูซูทีมชาติ #ssru #วูซู",
  //   viewCount: "1.7k",
  //   url: "https://youtube.com/shorts/Wwih-fmMAIM?si=IbPOVAHgynq7EF_4",
  // },
  {
    id: "lHoC6emGIH4",
    title:
      "#มืออาชีพ ไม่ใช่พรสวรรค์แต่คือ #มาตรฐาน | สัมภาษณ์ #วารสารแก้วเจ้าจอมออนไลน์ #ssru #news",
    viewCount: "896",
    url: "https://youtube.com/shorts/lHoC6emGIH4?si=nPM3pfTLNBUUZ7_2",
  },
  {
    id: "nvbhXeZMhXM",
    title: "พลิกวิกฤตให้เป็น “โอกาส” #วารสารแก้วเจ้าจอมออนไลน์ #ssru #news #คณะมนุษยศาสตร์และสังคมศาสตร์",
    viewCount: "405",
    url: "https://youtube.com/shorts/nvbhXeZMhXM?si=fDfS1lyfbBGjCdy4",
  },
  {
    id: "_26moSxT3Fs",
    title: "“จากห้องเรียนสู่เวทีโลก” 🌎 สัมภาษณ์| #วารสารแก้วเจ้าจอมออนไลน์ #วิจัย #ssru #news",
    viewCount: "200",
    url: "https://youtube.com/shorts/_26moSxT3Fs?si=Ol8wpz8tN8D9ARg8",
  },
  {
    id: "TosuzqzoEdU",
    title: "“แพรพลอย หัวใจเพ็ชร”นักกีฬาฟุตซอลหญิง #ssru ทีมชาติไทย #ssru #วารสารแก้วเจ้าจอมออนไลน์ #กีฬา #ฟุตบอล",
    viewCount: "189",
    url: "https://youtube.com/shorts/TosuzqzoEdU?si=pdZMHc2-uNvKxvIA",
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

      {/* Mobile + iPad */}
      <div className="xl:hidden">
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

      {/* Desktop: keep original grid */}
      <div className="hidden xl:block">
        <Swiper
          modules={[Grid, Navigation]}
          spaceBetween={16}
          slidesPerView={2}
          grid={{ rows: 2, fill: "row" }}
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
                      <span>• {item.viewCount} views</span>
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
