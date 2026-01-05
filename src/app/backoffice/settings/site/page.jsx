"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  createLucideIcon,
  Facebook,
  ImagePlus,
  Instagram,
  LinkIcon,
  X,
} from "lucide-react";

const XIcon = createLucideIcon("X", [
  [
    "path",
    {
      d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
      stroke: "none",
      fill: "currentColor",
    },
  ],
]);

export default function Page() {
  const logoInput = useRef(null);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="pb-4 border-b mb-8">
        <h2 className="font-bold text-3xl">Site Settings</h2>
        <p className="text-muted-foreground">จัดการข้อมูลพื้นฐานของเว็บไซต์</p>
      </div>

      {/* Site name */}
      <div className="flex gap-6 mb-6 border-b pb-6">
        <div className="w-64 pt-2">
          <Label>โลโก้</Label>
        </div>
        <div className="flex-1 ">
          <Button
            type="button"
            variant="outline"
            onClick={() => logoInput.current?.click()}
          >
            <ImagePlus />
            เลือกไฟล์
          </Button>

          <input
            ref={logoInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />

          <div className="w-full h-64 bg-gray-200 mt-4 border rounded-2xl relative">
            <img
              src={logoPreview || "/assets/images/logo_new.png"}
              className="w-full h-full object-contain"
              alt="logo preview"
            />

            <button
              type="button"
              onClick={() => {
                setLogo(null);
                setLogoPreview(null);

                if (logoInput.current) {
                  logoInput.current.value = "";
                }
              }}
              className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full z-20"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer text */}
      <div className="flex gap-6 mb-6 border-b pb-6">
        <div className="w-64 pt-2">
          <Label>ข้อความฟุตเตอร์</Label>
        </div>
        <div className="flex-1 ">
          <Textarea rows={4} />
        </div>
      </div>

      {/* Email */}
      <div className="flex gap-6 mb-6 border-b pb-6">
        <div className="w-64 pt-2">
          <Label>ข้อมูลติดต่อ</Label>
        </div>
        <div className="flex-1 ">
          <div>
            <Label className="text-xs text-muted-foreground">เบอร์โทร</Label>
            <Input type="email" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">อีเมล</Label>
            <Input type="email" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">ที่อยู่หน่วยงาน</Label>
            <Textarea rows={4} />
          </div>
        </div>
      </div>

      

      {/* Action */}
      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
