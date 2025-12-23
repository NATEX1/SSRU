"use client";

import { LinkIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function ShareButtons({ title }) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const url = useMemo(() => {
    const base =
      (process.env.APP_URL || "https://ssru.onrender.com/").replace(/\/$/, "") || origin;
    return base ? `${base}${pathname}` : pathname || "";
  }, [origin, pathname]);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(title || "");

  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodedUrl}%0A%0A${encodedUrl}`;

  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`;
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <strong>แชร์เรื่องนี้:</strong>
      <ul className="flex gap-4">
        <li>
          <a href={lineShareUrl} target="_blank" rel="noopener noreferrer">
            <img
              src="/assets/images/line.png"
              className="rounded-full h-8 w-8"
              alt="แชร์ผ่าน Line"
            />
          </a>
        </li>

        <li>
          <a href={xShareUrl} target="_blank" rel="noopener noreferrer">
            <img
              src="/assets/images/x.png"
              className="rounded-full h-8 w-8"
              alt="แชร์ผ่าน X"
            />
          </a>
        </li>

        <li>
          <a href={fbShareUrl} target="_blank" rel="noopener noreferrer">
            <img
              src="/assets/images/facebook.png"
              className="rounded-full h-8 w-8"
              alt="แชร์ผ่าน Facebook"
            />
          </a>
        </li>

        <li>
          <button type="button" onClick={copyLink} className="text-[#6A7282]">
            <div className="size-8 border border-[#E5E7EB] flex items-center justify-center rounded-full">
              <LinkIcon className="h-3" />
            </div>
          </button>
        </li>
      </ul>

      {copied && <span className="text-xs text-[#6A7282]">คัดลอกลิงก์แล้ว</span>}
    </div>
  );
}
