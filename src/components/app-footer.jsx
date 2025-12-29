import React from "react";

export default function AppFooter() {
  return (
    <footer className="bg-[#F9FAFB] border border-[#F3F4F6] mt-8">
      <div className="container mx-auto px-4 py-8
        flex flex-col gap-8
        lg:flex-row lg:items-center lg:justify-between">

        {/* Logo + Info */}
        <div className="flex flex-col items-center gap-4
          lg:flex-row lg:items-center lg:gap-8 lg:text-left text-center">

          <img
            src="/assets/images/logo_new.png"
            className="h-[90px] lg:h-[125px]"
            alt="logo"
          />

          <div>
            <p className="text-lg font-semibold text-[#101828]">
              เว็บไซต์วารสารแก้วเจ้าจอมออนไลน์
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
          lg:items-start lg:min-w-[220px]">

          <p className="text-[#6A7282] mb-1">ติดต่อโฆษณา</p>

          <a href="tel:021601023"
            className="flex items-center gap-2 text-[#6A7282] hover:underline">
            <img src="/assets/images/call.png" className="h-3 w-3" alt="call" />
            02 160 1023
          </a>

          <a href="mailto:pr@ssru.ac.th"
            className="flex items-center gap-2 text-[#6A7282] hover:underline">
            <img src="/assets/images/mail.png" className="h-4 w-4" alt="mail" />
            pr@ssru.ac.th
          </a>
        </ul>

        {/* Social */}
        

      </div>
    </footer>

  );
}
