import { Search, SquarePen } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AppHeader() {
  return (
    <header className="fixed top-0 w-full border-b border-[#F3F4F6] bg-white z-40">
      <div className="container mx-auto h-20 px-4 flex items-center justify-between">
        <div className="hidden md:flex w-64 h-9 px-2 py-2 items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full focus-within:border-[#F06FAA]">
          <Search className="h-[1em] text-[#99A1AF]" />
          <input
            type="text"
            placeholder="ค้นหา..."
            className="w-full outline-none"
          />
        </div>

        <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
          <img src="/assets/images/logo_new.png" alt="logo" className="h-12 w-auto md:size-20" />
        </div>

       <div className="flex items-center gap-4">
         <div className="border border-[#E5E7EB] rounded-full ml-auto z-10 flex p-0.5">
          <div className="px-3 py-1 bg-[#F06FAA] rounded-full cursor-pointer border-0">
            TH
          </div>
          <div className="px-3 py-1 bg-white! rounded-full cursor-pointer border-0">
            EN
          </div>
          <div className="px-3 py-1 bg-white! rounded-full cursor-pointer border-0">
            CN
          </div>
        </div>

        
       </div>
      </div>
    </header>
  );
}
