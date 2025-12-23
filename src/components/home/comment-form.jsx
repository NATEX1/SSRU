"use client";

import React, { useState } from "react";

export default function CommentForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("กำลังส่ง...");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setStatus("ส่งข้อความเรียบร้อย!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        const data = await res.json();
        setStatus("เกิดข้อผิดพลาด: " + data.error);
      }
    } catch (err) {
      setStatus("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#F9FAFB] border border-[#F3F4F6] p-4 rounded-xl"
    >
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-200 w-full outline-none bg-white rounded-lg px-4 py-2 focus-within:border-[#F06FAA]"
        />
      </div>

      <div className="mb-4">
        <label>อีเมล</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-200 w-full outline-none bg-white rounded-lg px-4 py-2 focus-within:border-[#F06FAA]"
        />
      </div>

      <div className="mb-4">
        <label>
          ความคิดเห็น<span className="text-red-500">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-gray-200 w-full outline-none bg-white rounded-lg px-4 py-2 focus-within:border-[#F06FAA]"
        />
      </div>

      <div className="text-center mb-2">
        <button className="btn bg-[#F06FAA] text-white rounded-lg">
          ส่งข้อความ
        </button>
      </div>

      {status && <p className="text-center text-sm">{status}</p>}
    </form>
  );
}
