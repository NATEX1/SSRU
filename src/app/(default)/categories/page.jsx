import Pagination from "@/components/pagination";
import { Eye, Share2 } from "lucide-react";
import React from "react";

export default function page() {
  return (
    <div className="space-y-8">
      <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-8">
        <img
          src="/assets/images/category-banner.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="text-center flex flex-col items-center">
        <h1 className="text-[#3F458D] text-5xl font-semibold">งานวิจัยแนะนำ</h1>
        <p className="text-[#4A5565]">
          รวบรวมผลงานวิจัยที่โดดเด่นและน่าสนใจจากคณาจารย์และนักศึกษา <br />
          มหาวิทยาลัยราชภัฏสวนสุนันทา
        </p>
        <div className=" rounded bg-[#F06FAA] w-24 h-1 mt-8"></div>
      </div>

      <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto ">
        {Array.from({ length: 12 }).map((i) => (
          <div className="card shadow-sm group" key={i}>
            <figure>
              <a href="">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                  alt="Shoes"
                  className="group-hover:scale-105 transition duration-150"
                />
              </a>
            </figure>
            <div className="card-body">
              <p className="text-xs text-[#99A1AF]">
                <span className="text-[#F06FAA]">ดร. สมชาย ใจดี</span>
                <span>|</span>
                <span>28 พ.ย. 2023</span>
              </p>
              <a href="">
                <h2 className="card-title hover:underline">
                  การพัฒนาศักยภาพการท่องเที่ยวเชิง วัฒนธรรมในเขตดุสิต (1)
                </h2>
              </a>
              <p className="text-[#4A5565]">
                การศึกษาแนวทางการส่งเสริมและพัฒนาเส้นทางการท่องเที่ยวเชิงวัฒนธรรม
                เพื่อยกระดับรายได้ชุมชนและอนุรักษ์มรดกทางวัฒนธรรม
              </p>
              <div className="card-actions">
                <div className="flex gap-2">
                  <p className="text-[#99A1AF] flex items-center gap-1">
                    <Eye className="h-[1em]" />
                    <span>1,250 อ่าน</span>
                  </p>
                  <p className="text-[#99A1AF] flex items-center gap-1">
                    <Share2 className="h-[1em]" />
                    <span>45 แชร์</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <Pagination />
      </div>
    </div>
  );
}
