"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        if (window.history.length > 1) {
          router.back(); // กลับไปหน้าก่อนหน้า
        } else {
          router.replace("/"); // fallback หน้า home
        }
      }}
      className="inline-flex items-center gap-2 text-sm text-[#6A7282] mb-6 hover:underline"
    >
      <ArrowLeft className="h-4" />
      กลับหน้ารวมรายการ
    </button>
  );
}
