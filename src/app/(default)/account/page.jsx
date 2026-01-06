"use client";

import { Pencil } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [user, setUser] = useState(null);

  // สำหรับ confirm upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const fileRef = useRef(null);

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        setUser(data);
      } catch {
        toast.error("โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  /* ================= SELECT IMAGE ================= */
  const handleSelectImage = (file) => {
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= CONFIRM UPLOAD ================= */
  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      // 1. upload file
      const formData = new FormData();
      formData.append("image", selectedFile);

      const uploadRes = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error();

      const imageUrl = uploadData.file.url;

      // 2. update database ทันที
      const res = await fetch("/api/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageUrl }),
      });

      if (!res.ok) throw new Error();

      // 3. update state
      setUser({ ...user, image: imageUrl });

      toast.success("เปลี่ยนรูปโปรไฟล์เรียบร้อย");

      setSelectedFile(null);
      setPreview(null);
    } catch {
      toast.error("เปลี่ยนรูปไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          position: user.position,
          image: user.image,
        }),
      });

      if (!res.ok) throw new Error();
      toast.success("อัปเดตโปรไฟล์เรียบร้อย");
    } catch {
      toast.error("บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 mt-8 border rounded-2xl">
        <h1 className="text-2xl font-bold">บัญชีของฉัน</h1>
      {/* ================= PROFILE IMAGE ================= */}
      <div className="flex flex-col items-center">
        <div className="size-40 relative rounded-full border-4 border-white shadow my-3">
          <img
            className="w-full h-full object-cover rounded-full"
            src={preview || user.image || "/assets/images/user.png"}
            alt=""
          />

          <button
            onClick={() => fileRef.current.click()}
            className="absolute bg-white size-8 bottom-0 right-0.5 rounded-full border flex items-center justify-center"
          >
            <Pencil className="size-4" />
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleSelectImage(e.target.files[0])}
          />
        </div>

        <span className="text-muted-foreground text-sm">เปลี่ยนรูปโปรไฟล์</span>

        {/* ===== CONFIRM UPLOAD ===== */}
        {preview && (
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setPreview(null);
                setSelectedFile(null);
              }}
            >
              ยกเลิก
            </Button>

            <Button
              size="sm"
              onClick={handleConfirmUpload}
              disabled={uploading}
            >
              {uploading ? "กำลังอัปโหลด..." : "ยืนยันเปลี่ยนรูป"}
            </Button>
          </div>
        )}
      </div>

      {/* ================= FORM ================= */}
      <div className="space-y-4 mt-6">
        <Input
          placeholder="ชื่อ"
          value={user.name || ""}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />

        {/* <Input
          placeholder="ตำแหน่ง"
          value={user.position || ""}
          onChange={(e) => setUser({ ...user, position: e.target.value })}
        /> */}

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </Button>
      </div>
    </div>
  );
}
