import React from "react";

export default function AppFooter() {
  return (
    <footer className="bg-[#F9FAFB] border border-[#F3F4F6] mt-8">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex gap-8 items-center">
          <img
            src="assets/images/logo_new.png"
            className="h-[125px]"
            alt="logo" style="width:100%"
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
          <li>
            <p className="text-[#6A7282]">
              ติดต่อโฆษณา<br />
              <a href="tel:021601023" className="hover:underline"><img src="/assets/images/call.png" className="h-4 w-4"/> 02 160 1023 </a><br />
              <a href="mailto:pr@ssru.ac.th" className="hover:underline"><img src="/assets/images/mail.png" className="h-4 w-4"/> pr@ssru.ac.th </a><br />
            </p>
          </li>
          <li>
            <a href="" className="text-[#6A7282] hover:underline">
              ช่องทางส่งบทความ
            </a>
          </li>
        </ul>

        <ul className="flex gap-8">
          <li>
            <a href="https://www.youtube.com/@ssrutube/shorts" className="text-[#6A7282]">
              <img
                src="/assets/images/YouTube.webp"
                className="rounded-full h-8 w-8"
                alt="" style="width:80px;hight:80px;"
              />
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/kaewchaochomonline" className="text-[#6A7282]">
              <img
                src="/assets/images/facebook.png"
                className="rounded-full h-8 w-8"
                alt="" style="width:80px;hight:80px;"
              />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/ssru_official?igsh=cjQ1dW5jM3E3cmM1&utm_source=qr" className="text-[#6A7282]">
              <img
                src="/assets/images/Instagram.webp"
                className="rounded-full h-8 w-8"
                alt="" style="width:80px;hight:80px;"
              />
            </a>
          </li>
          <li>
            <a href="https://x.com/official_ssru?s=21&t=JiEIQMw3IlVQkEh6kGiHaA" className="text-[#6A7282]">
              <img
                src="/assets/images/x.png"
                className="rounded-full h-8 w-8"
                alt="" style="width:80px;hight:80px;"
              />
            </a>
          </li>
          <li>
            <a href="https://lin.ee/1WNbkCe" className="text-[#6A7282]">
              <img
                src="/assets/images/line.png"
                className="rounded-full h-8 w-8"
                alt="" style="width:80px;hight:80px;"
              />
            </a>
          </li>
          <li>
            <a href="https://www.tiktok.com/@ssru_official?_r=1&_t=ZS-927UzisFNKq" className="text-[#6A7282]">
              <img
                src="/assets/images/tiktok.webp"
                className="rounded-full h-8 w-8"
                alt="" style="width:80px;hight:80px;"
              />
            </a>
          </li>
          
        </ul>
      </div>
    </footer>
  );
}
