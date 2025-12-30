"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function AppHeader() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (mobileSearchOpen) setTimeout(() => inputRef.current?.focus(), 0);
  }, [mobileSearchOpen]);

  return (
    <header className="fixed top-0 w-full border-b border-[#F3F4F6] bg-white z-40">
      <div className="relative container mx-auto h-20 px-4 flex items-center justify-between">
        <div className="w-10 lg:w-72" />

        {/* Center Logo */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200
            ${mobileSearchOpen ? "opacity-0 lg:opacity-100" : "opacity-100"}`}
        >
          <img
            src="/assets/images/logo_new.png"
            alt="logo"
            className="h-14 w-14 lg:h-40 lg:w-40 object-contain"
          />
        </div>

        {/* Desktop Search  */}
        <div className="hidden lg:flex w-72 h-9 px-3 py-2 items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full focus-within:border-[#F06FAA]">
          <Search className="h-[1em] text-[#99A1AF]" />
          <input
            type="text"
            placeholder="ค้นหา..."
            className="w-full outline-none bg-transparent"
          />
        </div>

        {/* Right: Mobile Search Icon + Language */}
        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            onClick={() => setMobileSearchOpen(true)}
            className={`lg:hidden p-2 rounded-full border border-[#F3F4F6] bg-white hover:bg-gray-50 transition
              ${mobileSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            aria-label="Open search"
          >
            <Search className="h-5 w-5 text-gray-700" />
          </button>

          {/* Language Switch */}
          <div
            className={`border border-[#E5E7EB] rounded-full flex p-0.5 bg-white transition-opacity duration-200
              ${mobileSearchOpen ? "opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto" : "opacity-100"}`}
          >
            <button
              type="button"
              className="px-3 py-1 bg-[#F06FAA] text-white rounded-full text-sm"
            >
              TH
            </button>
            <button
              type="button"
              className="px-3 py-1 bg-white rounded-full text-sm text-[#111827] hover:bg-gray-50"
            >
              EN
            </button>
            <button
              type="button"
              className="px-3 py-1 bg-white rounded-full text-sm text-[#111827] hover:bg-gray-50"
            >
              CN
            </button>
          </div>
        </div>

        {/* Mobile Search Input Overlay  */}
        <div
          className={`lg:hidden absolute left-4 right-4 top-1/2 -translate-y-1/2 transition-all duration-200
            ${mobileSearchOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
        >
          <div className="w-full h-10 px-3 py-2 flex items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full focus-within:border-[#F06FAA] shadow-sm">
            <Search className="h-[1em] text-[#99A1AF]" />
            <input
              ref={inputRef}
              type="text"
              placeholder="ค้นหา..."
              className="w-full outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="p-1 rounded-full hover:bg-gray-200 transition"
              aria-label="Close search"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
