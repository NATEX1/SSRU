"use client";

import { Search, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export default function AppHeader() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [mobileSearchOpen]);

  return (
    <header className="fixed top-0 w-full border-b border-[#F3F4F6] bg-white z-40">
      <div className="relative container mx-auto h-20 px-4 flex items-center justify-between">
        
        {/* Left: Search (Desktop only) */}
        <div className="hidden lg:flex w-72 h-9 px-3 py-2 items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full focus-within:border-[#F06FAA]">
          <Search className="h-[1em] text-[#99A1AF]" />
          <input
            type="text"
            placeholder="ค้นหา..."
            className="w-full outline-none bg-transparent"
          />
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <img
            src="/assets/images/logo_new.png"
            alt="logo"
            className="h-20 w-20 lg:h-40 lg:w-40 object-contain"
          />
        </div>

        {/* Right: Language Switch (Desktop only) */}
        {/* <div className="ml-auto hidden lg:flex items-center">
          <div className="border border-[#E5E7EB] rounded-full flex p-0.5 bg-white">
            <button className="px-3 py-1 bg-[#F06FAA] text-white rounded-full text-sm">
              TH
            </button>
            <button className="px-3 py-1 rounded-full text-sm text-[#111827] hover:bg-gray-50">
              EN
            </button>
            <button className="px-3 py-1 rounded-full text-sm text-[#111827] hover:bg-gray-50">
              CN
            </button>
          </div>
        </div> */}
        <ul className="hidden lg:flex items-center gap-3">
          {[
            ["YouTube.webp", "https://www.youtube.com/@ssrutube/shorts"],
            ["facebook.png", "https://www.facebook.com/kaewchaochomonline"],
            ["Instagram.webp", "https://www.instagram.com/ssru_official"],
            ["x.png", "https://x.com/official_ssru"],
            ["line.png", "https://lin.ee/1WNbkCe"],
            ["tiktok.webp", "https://www.tiktok.com/@ssru_official"],
          ].map(([img, link], i) => (
            <li key={i}>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <img
                  src={`/assets/images/${img}`}
                  alt=""
                  className="
                    h-7 w-7 
                    rounded-full 
                    border border-[#E5E7EB]
                    bg-white
                    p-1
                    transition
                    group-hover:scale-105
                    group-hover:shadow-sm
                    group-hover:opacity-90
                  "
                />
              </a>
            </li>
          ))}
        </ul>

      </div>
    </header>
  );
}
