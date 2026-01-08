import React from "react";

export default function AppFooter() {
  return (
    <footer className="bg-[#F9FAFB] border border-[#F3F4F6] mt-8">
      <div className="container mx-auto px-4 py-8
        flex flex-col gap-8
        xl:flex-row xl:items-center xl:justify-between">

        {/* Logo + Info */}
        <div className="flex flex-col items-center gap-4
          xl:flex-row xl:items-center xl:gap-8 xl:text-left text-center">

          <img
            src="/assets/images/logo_new.png"
            className="h-[90px] xl:h-[125px]"
            alt="logo"
          />

          <div>
            <p className="text-lg font-semibold text-[#101828]">
              วารสารแก้วเจ้าจอมออนไลน์
            </p>
            <p className="text-[#6A7282] text-sm leading-relaxed">
              คณะกรรมการกำหนดทิศทางยุทธศาสตร์ในการสื่อสารองค์กร <br />
              มหาวิทยาลัยราชภัฏสวนสุนันทา <br />
              ที่อยู่ เลขที่ 1 ถนนอู่ทองนอก เขตดุสิต กรุงเทพมหานคร 10300
            </p>
          </div>
        </div>

        {/* Contact */}
        <ul className="flex flex-col items-center gap-2
          xl:items-start xl:min-w-[220px]">

          <p className="text-[#6A7282] mb-1">ติดต่อโฆษณา</p>

          <a href="tel:021601023"
            className="flex items-center gap-2 text-[#6A7282] hover:underline">
            <img src="/assets/images/call.png" className="h-3 w-3" alt="call" />
            02 160 1023
          </a>

          <a href="mailto:kcc@ssru.ac.th"
            className="flex items-center gap-2 text-[#6A7282] hover:underline">
            <img src="/assets/images/mail.png" className="h-4 w-4" alt="mail" />
            kcc@ssru.ac.th
          </a>
        </ul>

        {/* Social */}
        <ul className="flex justify-center flex-wrap gap-4">
          {[
            ["YouTube.webp", "https://www.youtube.com/playlist?list=PL9rBdn9yFjyvkR2D4qZIc5A1_or_CT_XL"],
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
                  className="rounded-full h-6 w-6 hover:opacity-80 transition"
                  alt=""
                />
              </a>
            </li>
          ))}
        </ul>
          <br /><br />
      </div>
    </footer>

  );
}
