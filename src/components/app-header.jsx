"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function AppHeader() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const inputRef = useRef(null);

  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };

  const [settings, setSettings] = useState(null);
  const [socialLinks, setSocialLinks] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, socialRes] = await Promise.all([
          fetch("/api/site-settings"),
          fetch("/api/social-links")
        ]);

        const settingsData = await settingsRes.json();
        const socialData = await socialRes.json();

        setSettings(settingsData);
        setSocialLinks(socialData);
      } catch (error) {
        console.error("fetch data error:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [mobileSearchOpen]);

  const socialIcons = {
    youtube: "YouTube.webp",
    facebook: "facebook.png",
    instagram: "Instagram.webp",
    twitter: "x.png",
    line: "line.png",
    tiktok: "tiktok.webp",
  };

  return (
    <header className="fixed top-0 w-full border-b border-[#F3F4F6] bg-white z-40">
      <div className="relative container mx-auto h-20 px-4 flex items-center justify-between">
        {/* Left: Search (Desktop only) */}
        <form onSubmit={handleSubmit} className="hidden xl:flex w-72 h-9 px-3 py-2 items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full focus-within:border-[#F06FAA]">
          <Search className="h-[1em] text-[#99A1AF]" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="ค้นหา..."
            className="w-full outline-none bg-transparent"
          />
        </form>

        {/* Center Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <img
            src={settings?.logo || "/assets/images/logo_new.png"}
            alt="logo"
            className="h-20 w-20 xl:h-40 xl:w-40 object-contain"
          />
        </div>

        {/* Right: Language Switch (Desktop only) */}
        {/* <div className="ml-auto hidden xl:flex items-center">
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
        <ul className="hidden xl:flex items-center gap-3">
          {Object.entries(socialLinks).map(([platform, url]) => {
            if (!url || !socialIcons[platform]) return null;
            return (
              <li key={platform}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <img
                    src={`/assets/images/${socialIcons[platform]}`}
                    alt={platform}
                    className="
                      h-8 w-8 
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
            );
          })}
        </ul>
      </div>
    </header>
  );
}
