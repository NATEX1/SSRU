import { BookOpen } from "lucide-react";
import React from "react";

const magazines = [
  {
    image: "/contents/magazine1.jpg",
    issue: "Issue 12",
    year: "2025",
    title: "รอบรั้วแก้วเจ้าจอมฉบับที่ 1",
    type: "Digital Version Available",
    link: "https://online.fliphtml5.com/eakkq/ftzw/",
  },
  {
    image: "/contents/magazine2.jpg",
    issue: "Issue 12",
    year: "2025",
    title: "รอบรั้วแก้วเจ้าจอมฉบับที่ 2",
    type: "Digital Version Available",
    link: "https://online.fliphtml5.com/eakkq/lodv/",
  },
];

export default function page() {
  return (
    <div className="space-y-8">
      {/* <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-8">
        <img
          src="/assets/images/category-banner.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div> */}

      <div className="text-center flex flex-col items-center mt-8">
        <h1 className="text-[#3F458D] text-5xl font-bold">SSRU Around</h1>
        {/* <p className="text-[#4A5565]">
          รวบรวมผลงานวิจัยที่โดดเด่นและน่าสนใจจากคณาจารย์และนักศึกษา <br />
          มหาวิทยาลัยราชภัฏสวนสุนันทา
        </p> */}
        <div className=" rounded bg-[#F06FAA] w-24 h-1 mt-8"></div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {magazines.map((item, i) => (
          <a href={item.link} key={i} target="__bank">
            <div className="card border shadow">
              <figure>
                <img src={item.image} alt="" />
              </figure>

              <div className="card-body">
                <div className="flex justify-end">
                  <div className="text-xs text-[#99A1AF]">{item.year}</div>
                </div>
                <h2 className="card-title">{item.title}</h2>
                {/* <p>{item.link}</p> */}
                <div className="flex gap-1 items-center text-[#99A1AF] text-sm">
                  <BookOpen className="h-4" />
                  <p>{item.type}</p>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
