import React from "react";

export default function AppFooter() {
  return (
    <footer className="bg-[#F9FAFB] border border-[#F3F4F6] mt-8">
      <div className="container flex items-center justify-between">
        <div className="flex gap-8 items-center">
          <img
            src="assets/images/logo.png"
            className="w-[125px] h-[125px]"
            alt="logo"
          />
          <div>
            <p className=" text-lg font-semibold text-[#101828]">
              เว็บไซต์วารสารแก้วเจ้าจอมออนไลน์
            </p>
            <p className="text-[#6A7282]">
              ฝ่ายประชาสัมพันธ์และโสตทัศนูปกรณ์ มหาวิทยาลัยราชภัฎ สวนสุนันทา{" "}
              <br />
              โทร 094 498 5317, 02 160 1000
            </p>
          </div>
        </div>

        <ul className="flex gap-8">
          <li>
            <a href="" className="text-[#6A7282] hover:underline">
              เกี่ยวกับเรา
            </a>
          </li>
          <li>
            <a href="" className="text-[#6A7282] hover:underline">
              ติดต่อโฆษณา
            </a>
          </li>
          <li>
            <a href="" className="text-[#6A7282] hover:underline">
              นโยบายความเป็นส่วนตัว
            </a>
          </li>
        </ul>

        <ul className="flex gap-8">
          <li>
            <a href="" className="text-[#6A7282]">
              <img
                src="/assets/images/line.png"
                className="rounded-full h-8 w-8"
                alt=""
              />
            </a>
          </li>
          <li>
            <a href="" className="text-[#6A7282]">
              <img
                src="/assets/images/x.png"
                className="rounded-full h-8 w-8"
                alt=""
              />
            </a>
          </li>
          <li>
            <a href="" className="text-[#6A7282]">
              <img
                src="/assets/images/facebook.png"
                className="rounded-full h-8 w-8"
                alt=""
              />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
