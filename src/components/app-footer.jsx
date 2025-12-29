import React from "react";

export default function AppFooter() {
  return (
    <footer className="bg-[#F9FAFB] border border-[#F3F4F6] mt-8">
      <div className="container mx-auto px-4 py-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-8 items-center">
          <img
            src="/assets/images/logo_new.png"
            className="h-[125px]"
            alt="logo" 
          />
          <div>
            <p className=" text-lg font-semibold text-[#101828]">
              เว็บไซต์วารสารแก้วเจ้าจอมออนไลน์
            </p>
            <p className="text-[#6A7282]">
              คณะกรรมการกำหนดทิศทางยุทธศาสตร์ในการสื่อสารองค์กร {" "} <br />
              มหาวิทยาลัยราชภัฏสวนสุนันทา <br />
              ที่อยู่ เลขที่ 1 ถนนอู่ทองนอก เขตดุสิต กรุงเทพมหานคร 10300
            </p>
          </div>
        </div>

        <ul className="flex gap-8">
          <li className="min-w-[220px]">
            <p className="text-[#6A7282] mb-1">ติดต่อโฆษณา</p>

            <a
              href="tel:021601023"
              className="flex items-center gap-2 text-[#6A7282] hover:underline"
            >
              <img
                src="/assets/images/call.png"
                className="h-3 w-3 "
                alt="call"
              /> 02 160 1023
            </a>

            <a
              href="mailto:pr@ssru.ac.th"
              className="flex items-center gap-2 text-[#6A7282] hover:underline mt-1"
            >
              <img
                src="/assets/images/mail.png"
                className="h-4 w-4 "
                alt="mail"
              /> pr@ssru.ac.th
            </a>
          </li>
        </ul>

        {/* Social */}
        <ul className="flex justify-center flex-wrap gap-4">
          {[
            ["YouTube.webp", "https://www.youtube.com/@ssrutube/shorts"],
            ["facebook.png", "https://www.facebook.com/kaewchaochomonline"],
            ["Instagram.webp", "https://www.instagram.com/ssru_official"],
            ["x.png", "https://x.com/official_ssru"],
            ["line.png", "https://lin.ee/1WNbkCe"],
            ["tiktok.webp", "https://www.tiktok.com/@ssru_official"],
          ].map(([img, link], i) => (
            <li key={i}>
              <a href={link}>
                <img
                  src={`/assets/images/${img}`}
                  className="rounded-full h-8 w-8 hover:opacity-80 transition"
                  alt=""
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
