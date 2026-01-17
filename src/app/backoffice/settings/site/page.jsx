"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  ImagePlus,
  Loader2,
  MapPin,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Page() {
  const logoInput = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [settings, setSettings] = useState({
    nameTh: "",
    nameEn: "",
    nameCn: "",
    logo: "",
    phone: "",
    email: "",
    googleMapLink: "",
    addressTh: "",
    addressEn: "",
    addressCn: "",
    officeHoursTh: "",
    officeHoursEn: "",
    officeHoursCn: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/site-settings");
        const data = await res.json();
        setSettings(data);
        if (data.logo) {
          setLogoPreview(data.logo);
        }
      } catch (error) {
        console.error("fetch settings error:", error);
        toast.error("ไม่สามารถดึงข้อมูลตั้งค่าได้");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));

      // Upload immediately or wait for save? 
      // Let's upload on save to keep it simple, or upload now and update state.
      // Usually better to upload now to get the URL.
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          setSettings((prev) => ({ ...prev, logo: data.file.url }));
        } else {
          toast.error("อัปโหลดรูปภาพไม่สำเร็จ");
        }
      } catch (error) {
        console.error("upload error:", error);
        toast.error("เกิดข้อผิดพลาดในการอัปโหลด");
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("บันทึกการเปลี่ยนแปลงสำเร็จ");
      } else {
        toast.error(data.message || "บันทึกไม่สำเร็จ");
      }
    } catch (error) {
      console.error("save error:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b mb-8 flex justify-between items-end">
        <div>
          <h2 className="font-bold text-3xl">Site Settings</h2>
          <p className="text-muted-foreground">จัดการข้อมูลพื้นฐานของเว็บไซต์</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          บันทึกการเปลี่ยนแปลง
        </Button>
      </div>

      {/* Logo */}
      <div className="flex gap-6 mb-8 border-b pb-8">
        <div className="w-64">
          <Label className="text-lg font-bold">โลโก้</Label>
          <p className="text-sm text-muted-foreground">โลโก้หลักของเว็บไซต์ ที่แสดงบน Navbar และ Footer</p>
        </div>
        <div className="flex-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => logoInput.current?.click()}
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            เลือกไฟล์
          </Button>

          <input
            ref={logoInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />

          <div className="w-full h-48 bg-gray-50 mt-4 border rounded-xl relative overflow-hidden group">
            {logoPreview ? (
              <img
                src={logoPreview}
                className="w-full h-full object-contain p-4"
                alt="logo preview"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground italic">
                ไม่ได้เลือกรูปภาพ
              </div>
            )}

            {logoPreview && (
              <button
                type="button"
                onClick={() => {
                  setLogo(null);
                  setLogoPreview(null);
                  setSettings((prev) => ({ ...prev, logo: "" }));
                  if (logoInput.current) {
                    logoInput.current.value = "";
                  }
                }}
                className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex gap-6 mb-8 border-b pb-8">
        <div className="w-64">
          <Label className="text-lg font-bold">ข้อมูลติดต่อ</Label>
          <p className="text-sm text-muted-foreground">ข้อมูลพื้นฐานสำหรับการติดต่อและแผนที่</p>
        </div>
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>เบอร์โทรศัพท์</Label>
              <Input
                value={settings.phone || ""}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="02-XXX-XXXX"
              />
            </div>
            <div className="space-y-2">
              <Label>อีเมล</Label>
              <Input
                value={settings.email || ""}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="contact@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Link Google Map</Label>
            <div className="flex gap-2">
              <Input
                value={settings.googleMapLink || ""}
                onChange={(e) => setSettings({ ...settings, googleMapLink: e.target.value })}
                placeholder="https://goo.gl/maps/..."
              />
              <Button variant="outline" size="icon" asChild>
                <a href={settings.googleMapLink || "#"} target="_blank" rel="noreferrer">
                  <MapPin className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Multilingual Content */}
      <div className="flex gap-6 mb-8">
        <div className="w-64 pt-2">
          <Label className="text-lg font-bold">ข้อมูลองค์กร</Label>
          <p className="text-sm text-muted-foreground">ที่อยู่, ข้อความเวลาทำการ และข้อความฟุตเตอร์</p>
        </div>
        <div className="flex-1">
          <Tabs defaultValue="th">
            <TabsList className="mb-4">
              <TabsTrigger value="th">ภาษาไทย (TH)</TabsTrigger>
              <TabsTrigger value="en">English (EN)</TabsTrigger>
              <TabsTrigger value="cn">中文 (CN)</TabsTrigger>
            </TabsList>

            <TabsContent value="th" className="space-y-6">
              <div className="space-y-2">
                <Label>ชื่อเว็บไซต์ (ไทย)</Label>
                <Input
                  value={settings.nameTh || ""}
                  onChange={(e) => setSettings({ ...settings, nameTh: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>ที่อยู่ (ไทย)</Label>
                <Textarea
                  rows={3}
                  value={settings.addressTh || ""}
                  onChange={(e) => setSettings({ ...settings, addressTh: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>เวลาทำการ (ไทย)</Label>
                <Input
                  value={settings.officeHoursTh || ""}
                  onChange={(e) => setSettings({ ...settings, officeHoursTh: e.target.value })}
                />
              </div>
            </TabsContent>

            <TabsContent value="en" className="space-y-6">
              <div className="space-y-2">
                <Label>Site Name (EN)</Label>
                <Input
                  value={settings.nameEn || ""}
                  onChange={(e) => setSettings({ ...settings, nameEn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Address (EN)</Label>
                <Textarea
                  rows={3}
                  value={settings.addressEn || ""}
                  onChange={(e) => setSettings({ ...settings, addressEn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Office Hours (EN)</Label>
                <Input
                  value={settings.officeHoursEn || ""}
                  onChange={(e) => setSettings({ ...settings, officeHoursEn: e.target.value })}
                />
              </div>
            </TabsContent>

            <TabsContent value="cn" className="space-y-6">
              <div className="space-y-2">
                <Label>网站名称 (CN)</Label>
                <Input
                  value={settings.nameCn || ""}
                  onChange={(e) => setSettings({ ...settings, nameCn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>地址 (CN)</Label>
                <Textarea
                  rows={3}
                  value={settings.addressCn || ""}
                  onChange={(e) => setSettings({ ...settings, addressCn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>营业时间 (CN)</Label>
                <Input
                  value={settings.officeHoursCn || ""}
                  onChange={(e) => setSettings({ ...settings, officeHoursCn: e.target.value })}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Action bottom */}
      <div className="flex justify-end pt-8 border-t">
        <Button onClick={handleSave} disabled={saving} size="lg" className="w-48">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          บันทึกการเปลี่ยนแปลง
        </Button>
      </div>
    </div>
  );
}
