import React from "react";

export default function Pagination() {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <a
        href="#"
        className="px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-100"
      >
        ‹ ก่อนหน้า
      </a>

      <a
        href="#"
        className="px-4 py-2 rounded-lg border-[#F06FAA] bg-[#F06FAA] text-white"
      >
        1
      </a>

      <a
        href="#"
        className="px-4 py-2 rounded-lg text-[#101828] hover:bg-gray-100"
      >
        2
      </a>

      <a
        href="#"
        className="px-4 py-2 rounded-lg text-[#101828] hover:bg-gray-100"
      >
        3
      </a>

      <span className="px-4 py-2 text-gray-400">...</span>

      <a
        href="#"
        className="px-4 py-2 rounded-lg text-[#101828] hover:bg-gray-100"
      >
        10
      </a>

      <a
        href="#"
        className="px-4 py-2 rounded-lg text-[#101828] hover:bg-gray-100"
      >
        ถัดไป ›
      </a>
    </div>
  );
}
