"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AddShortClipDialog() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("upload");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    titleTh: "",
    titleEn: "",
    titleCn: "",
    videoUrl: "",
    thumbnailUrl: "",
    youtubeUrl: "",
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const payload =
        type === "youtube"
          ? {
              type: "youtube",
              titleTh: form.titleTh,
              titleEn: form.titleEn,
              titleCn: form.titleCn,
              youtubeUrl: form.youtubeUrl,
            }
          : {
              type: "upload",
              titleTh: form.titleTh,
              titleEn: form.titleEn,
              titleCn: form.titleCn,
              videoUrl: form.videoUrl,
              thumbnailUrl: form.thumbnailUrl,
            };

      const res = await fetch("/api/admin/short-clips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("เพิ่มคลิปสำเร็จ");
      setOpen(false);
      setForm({
        titleTh: "",
        titleEn: "",
        titleCn: "",
        videoUrl: "",
        thumbnailUrl: "",
        youtubeUrl: "",
      });
    } catch (err) {
      toast.error(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ เพิ่มคลิป</Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>เพิ่ม Short Clip</DialogTitle>
        </DialogHeader>

        <Tabs value={type} onValueChange={setType}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="upload">อัปโหลดวิดีโอ</TabsTrigger>
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
          </TabsList>

          {/* ================= UPLOAD ================= */}
          <TabsContent value="upload" className="space-y-3 mt-4">
            <Input name="titleTh" placeholder="Title (TH)" onChange={onChange} />
            <Input name="titleEn" placeholder="Title (EN)" onChange={onChange} />
            <Input name="titleCn" placeholder="Title (CN)" onChange={onChange} />
            <Input
              name="videoUrl"
              placeholder="Video URL"
              onChange={onChange}
            />
            <Input
              name="thumbnailUrl"
              placeholder="Thumbnail URL"
              onChange={onChange}
            />
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </TabsContent>

          {/* ================= YOUTUBE ================= */}
          <TabsContent value="youtube" className="space-y-3 mt-4">
            <Input name="titleTh" placeholder="Title (TH)" onChange={onChange} />
            <Input name="titleEn" placeholder="Title (EN)" onChange={onChange} />
            <Input name="titleCn" placeholder="Title (CN)" onChange={onChange} />
            <Input
              name="youtubeUrl"
              placeholder="YouTube Link"
              onChange={onChange}
            />
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
