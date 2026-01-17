"use client";

import React, { useEffect, useState } from "react";

export default function AppFooter() {
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

  if (!settings) return null;

  const socialIcons = {
    youtube: "YouTube.webp",
    facebook: "facebook.png",
    instagram: "Instagram.webp",
    twitter: "x.png",
    line: "line.png",
    tiktok: "tiktok.webp",
  };

  return (
    <footer className="bg-[#F9FAFB] border border-[#F3F4F6] mt-8">
      <div className="container mx-auto px-4 py-8
        flex flex-col gap-8
        xl:flex-row xl:items-center xl:justify-between">

        {/* Logo + Info */}
        <div className="flex flex-col items-center gap-4
          xl:flex-row xl:items-center xl:gap-8 xl:text-left text-center">

          <img
            src={settings.logo || "/assets/images/logo_new.png"}
            className="h-[90px] xl:h-[125px] object-contain"
            alt="logo"
          />

          <div>
            <p className="text-xl font-bold text-[#101828]">
              {settings.nameTh}
            </p>
            <div className="text-[#6A7282] text-sm leading-relaxed whitespace-pre-line">
              {settings.addressTh}
            </div>
          </div>
        </div>

        {/* Contact */}
        <ul className="flex flex-col items-center gap-2
          xl:items-start xl:min-w-[220px]">

          <p className="text-[#6A7282] mb-1 font-semibold">ติดต่อเรา</p>

          {settings.phone && (
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-[#6A7282] hover:underline">
              <img src="/assets/images/call.png" className="h-3 w-3" alt="call" />
              {settings.phone}
            </a>
          )}

          {settings.email && (
            <a href={`mailto:${settings.email}`}
              className="flex items-center gap-2 text-[#6A7282] hover:underline">
              <img src="/assets/images/mail.png" className="h-4 w-4" alt="mail" />
              {settings.email}
            </a>
          )}
        </ul>

        {/* Social - Dynamic */}
        <ul className="flex justify-center flex-wrap gap-4">
          {Object.entries(socialLinks).map(([platform, url]) => {
            if (!url || !socialIcons[platform]) return null;
            return (
              <li key={platform}>
                <a href={url} target="_blank" rel="noreferrer">
                  <img
                    src={`/assets/images/${socialIcons[platform]}`}
                    className="rounded-full h-6 w-6 hover:opacity-80 transition"
                    alt={platform}
                  />
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </footer>
  );
}
