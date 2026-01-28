"use client";

import { useState } from "react";
import { Link as LinkIcon } from "lucide-react";

export default function ShareButtons({ title, articleId }) {
  const [copied, setCopied] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "");
  const url = `${baseUrl}/articles/${articleId}`;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const share = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
  };

  const trackShare = () => {
    fetch(`/api/articles/${articleId}/share`, {
      method: "POST",
    });
  };

  const openShare = (shareUrl) => {
    trackShare();
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    trackShare();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <strong className="text-sm">แชร์เรื่องนี้:</strong>

      <ul className="flex gap-3 items-center">
        <li>
          <button onClick={() => openShare(share.line)}>
            <img
              src="/assets/images/line.png"
              className="h-8 w-8 rounded-full"
            />
          </button>
        </li>

        <li>
          <button onClick={() => openShare(share.x)}>
            <img src="/assets/images/x.png" className="h-8 w-8 rounded-full" />
          </button>
        </li>

        <li>
          <button onClick={() => openShare(share.facebook)}>
            <img
              src="/assets/images/facebook.png"
              className="h-8 w-8 rounded-full"
            />
          </button>
        </li>

        <li>
          <button
            type="button"
            onClick={copyLink}
            className="h-8 w-8 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-gray-50"
            aria-label="คัดลอกลิงก์"
          >
            <LinkIcon className="h-4 w-4 text-[#6A7282]" />
          </button>
        </li>
      </ul>

      {copied && (
        <span className="text-xs text-[#6A7282]">คัดลอกลิงก์แล้ว</span>
      )}
    </div>
  );
}
