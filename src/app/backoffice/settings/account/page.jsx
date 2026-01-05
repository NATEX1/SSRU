"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";

export default function Page() {
  const inputImage = useRef(null)
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();

        setUser(data);
        setName(data.name);
        setPreview(data.image || "/assets/images/user.png");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    try {
      setSaving(true);

      const res = await fetch("/api/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setUser(updated);

      toast.success("อัปเดตข้อมูลเรียบร้อย");
    } catch (error) {
      toast.error("อัปเดตไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e)=>{
    const file = e.target.files[0]
    if(file){
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  if (loading) return <p>กำลังโหลด...</p>;
  if (!user) return <p>ไม่พบผู้ใช้</p>;

  return (
    <div>
      <div className="pb-4 border-b mb-8">
        <h2 className="font-bold text-3xl">บัญชีของฉัน</h2>
        <p className="text-muted-foreground">จัดการข้อมูลพื้นฐานของเว็บไซต์</p>
      </div>

      <form className="">
        <div className="flex mb-4 border-b pb-8">
          <div className="flex-1 space-y-4 ">
            <div>
              <Label>ชื่อผู้ใช้</Label>
              <Input
                placeholder="ชื่อ"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <Label>ตำแหน่ง</Label>
              <Input value={user.position || "ไม่มี"} disabled />
            </div>

            <div>
              <Label>อีเมล</Label>
              <Input value={user.email} disabled />
            </div>
          </div>

          <div className="w-64 flex flex-col items-center justify-center">
            <div className="relative size-36 mb-3">
              <div className="size-36 border-4 overflow-hidden border-white shadow rounded-full">
                <img
                  src={preview}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={() => inputImage.current?.click()}
                className="absolute cursor-pointer right-0 -bottom-1 size-10 z-20 bg-white border flex items-center justify-center rounded-full shadow"
              >
                <Pencil className="size-6" />
              </button>
              <input type="file" ref={inputImage} className="hidden" onChange={handleImageChange} />
            </div>
            <span className="text-muted-foreground text-sm">
              เปลี่ยนรูปโปรไฟล์
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleUpdate} disabled={saving}>
            {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </Button>
        </div>
      </form>
    </div>
  );
}
