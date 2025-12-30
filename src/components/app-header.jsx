import { Search, SquarePen } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AppHeader() {
  return (
    <header className="fixed top-0 w-full border-b border-[#F3F4F6] bg-white z-40">
      <div className="relative container mx-auto h-20 px-4 flex items-center justify-between">
        {/* Left: Search */}
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
            className="h-14 w-14 lg:h-20 lg:w-20 object-contain"
          />
        </div>

        {/* Right: Language Switch */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="border border-[#E5E7EB] rounded-full flex p-0.5 bg-white">
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
      </div>

      {/* Mobile Search bar */}
      <div className="lg:hidden border-t border-[#F3F4F6] bg-white">
        <div className="container mx-auto px-4 py-3">
          <div className="w-full h-10 px-3 py-2 flex items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full focus-within:border-[#F06FAA]">
            <Search className="h-[1em] text-[#99A1AF]" />
            <input
              type="text"
              placeholder="ค้นหา..."
              className="w-full outline-none bg-transparent"
            />
          </div>
        </div>
      </div>
    </header>

  );
}
