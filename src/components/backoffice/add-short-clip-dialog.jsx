"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function AddShortClipDialog({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("upload");
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [form, setForm] = useState({
    titleTh: "",
    titleEn: "",
    titleCn: "",
    youtubeUrl: "",
    order: 1,
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValidYoutubeUrl = (url) => {
    const patterns = [
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/,
    ];
    return patterns.some((pattern) => pattern.test(url));
  };

  const isValidVideoFile = (file) => {
    const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    return validTypes.includes(file.type);
  };

  const isValidImageFile = (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    return validTypes.includes(file.type);
  };

  const resetForm = () => {
    setForm({
      titleTh: "",
      titleEn: "",
      titleCn: "",
      youtubeUrl: "",
      order: 1,
    });
    setVideoFile(null);
    setThumbnailFile(null);
  };

  const handleTabChange = (newType) => {
    setType(newType);
    resetForm();
  };

  const handleSubmit = async () => {
    if (type === "upload") {
      if (!videoFile) {
        toast.error("กรุณาเลือกไฟล์วิดีโอ");
        return;
      }
      if (!thumbnailFile) {
        toast.error("กรุณาเลือกรูปปก");
        return;
      }
      if (!isValidVideoFile(videoFile)) {
        toast.error("ไฟล์วิดีโอต้องเป็น MP4, WebM, OGG หรือ MOV เท่านั้น");
        return;
      }
      if (!isValidImageFile(thumbnailFile)) {
        toast.error("รูปปกต้องเป็น JPG, PNG หรือ WebP เท่านั้น");
        return;
      }
      if (videoFile.size > 1024 * 1024 * 1024) {
        toast.error("ไฟล์วิดีโอต้องไม่เกิน 1GB");
        return;
      }
      if (thumbnailFile.size > 5 * 1024 * 1024) {
        toast.error("รูปปกต้องไม่เกิน 5MB");
        return;
      }
    }

    if (type === "youtube") {
      if (!form.youtubeUrl) {
        toast.error("กรุณาใส่ลิงก์ YouTube");
        return;
      }
      if (!isValidYoutubeUrl(form.youtubeUrl)) {
        toast.error("ลิงก์ YouTube ไม่ถูกต้อง");
        return;
      }
    }

    if (!form.titleTh && !form.titleEn && !form.titleCn) {
      toast.error("กรุณาใส่ชื่อคลิปอย่างน้อย 1 ภาษา");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("titleTh", form.titleTh);
      formData.append("titleEn", form.titleEn);
      formData.append("titleCn", form.titleCn);
      formData.append("order", form.order);

      if (type === "upload") {
        formData.append("video", videoFile);
        formData.append("thumbnail", thumbnailFile);
      } else {
        formData.append("youtubeUrl", form.youtubeUrl);
      }

      const res = await fetch("/api/short-clips", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "เกิดข้อผิดพลาด");

      toast.success("เพิ่มคลิปสำเร็จ");
      setOpen(false);
      resetForm();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error adding clip:", err);
      toast.error(err.message || "เกิดข้อผิดพลาดในการเพิ่มคลิป");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ เพิ่มคลิป</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>เพิ่ม Short Clip</DialogTitle>
          <DialogDescription className="hidden">Add new short clip</DialogDescription>
        </DialogHeader>

        <Tabs value={type} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">อัปโหลดวิดีโอ</TabsTrigger>
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
          </TabsList>

          {/* ================= UPLOAD ================= */}
          <TabsContent value="upload" className="space-y-4">
            <div>
              <Label htmlFor="titleTh">Title (TH)</Label>
              <Input
                id="titleTh"
                name="titleTh"
                value={form.titleTh}
                onChange={onChange}
                placeholder="ชื่อคลิป (ภาษาไทย)"
              />
            </div>
            <div>
              <Label htmlFor="titleEn">Title (EN)</Label>
              <Input
                id="titleEn"
                name="titleEn"
                value={form.titleEn}
                onChange={onChange}
                placeholder="Clip title (English)"
              />
            </div>
            <div>
              <Label htmlFor="titleCn">Title (CN)</Label>
              <Input
                id="titleCn"
                name="titleCn"
                value={form.titleCn}
                onChange={onChange}
                placeholder="片段标题 (中文)"
              />
            </div>
            <div>
              <Label htmlFor="order">ลำดับการแสดง (Order)</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={form.order}
                onChange={onChange}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="video">วิดีโอ (สูงสุด 1GB)</Label>
              <Input
                id="video"
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <Label htmlFor="thumbnail">รูปปก (สูงสุด 5MB)</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button onClick={handleSubmit} disabled={loading} className="w-full">
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </TabsContent>

          {/* ================= YOUTUBE ================= */}
          <TabsContent value="youtube" className="space-y-4">
            <div>
              <Label htmlFor="youtubeUrl">YouTube URL</Label>
              <Input
                id="youtubeUrl"
                name="youtubeUrl"
                value={form.youtubeUrl}
                onChange={onChange}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <div>
              <Label htmlFor="titleTh-yt">Title (TH)</Label>
              <Input
                id="titleTh-yt"
                name="titleTh"
                value={form.titleTh}
                onChange={onChange}
              />
            </div>
            <div>
              <Label htmlFor="titleEn-yt">Title (EN)</Label>
              <Input
                id="titleEn-yt"
                name="titleEn"
                value={form.titleEn}
                onChange={onChange}
              />
            </div>
            <div>
              <Label htmlFor="titleCn-yt">Title (CN)</Label>
              <Input
                id="titleCn-yt"
                name="titleCn"
                value={form.titleCn}
                onChange={onChange}
              />
            </div>
            <div>
              <Label htmlFor="order-yt">ลำดับการแสดง (Order)</Label>
              <Input
                id="order-yt"
                name="order"
                type="number"
                value={form.order}
                onChange={onChange}
                placeholder="0"
              />
            </div>
            <Button onClick={handleSubmit} disabled={loading} className="w-full">
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}