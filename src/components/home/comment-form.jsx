"use client";

import React from "react";

export default function CommentForm() {
  return (
    <form className="bg-[#F9FAFB] border border-[#F3F4F6] p-4 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-6 bg-[#F06FAA] rounded" />
        <h4 className="text-2xl font-bold">กล่องรับความคิดเห็น</h4>
      </div>

      <div className="mb-4">
        <label>
          ชื่อ-นามสกุล<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="border border-gray-200 w-full outline-none bg-white rounded-lg px-4 py-2 focus-within:border-[#F06FAA]"
        />
      </div>

      <div className="mb-4">
        <label>อีเมลที่ติดต่อกลับ</label>
        <input
          type="text"
          className="border border-gray-200 w-full outline-none bg-white rounded-lg px-4 py-2 focus-within:border-[#F06FAA]"
        />
      </div>

      <div className="mb-4">
        <label>
          ความคิดเห็นของท่าน<span className="text-red-500">*</span>
        </label>
        <textarea
          type="text"
          className="border border-gray-200 w-full outline-none bg-white rounded-lg px-4 py-2 focus-within:border-[#F06FAA]"
        ></textarea>
      </div>

      <div className="text-center">
        <button className="btn bg-[#F06FAA] text-white rounded-lg">ส่งข้อความ</button>
      </div>
    </form>
  );
}
