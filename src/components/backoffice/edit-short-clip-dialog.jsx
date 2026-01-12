"use client";
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function EditShortClipDialog({ open, setOpen, data, onSuccess }) {
    const [type, setType] = useState("upload");
    const [loading, setLoading] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [form, setForm] = useState({
        titleTh: "",
        titleEn: "",
        titleCn: "",
        youtubeUrl: "",
    });

    useEffect(() => {
        if (data) {
            setType(data.youtubeUrl ? "youtube" : "upload");
            setForm({
                titleTh: data.titleTh || "",
                titleEn: data.titleEn || "",
                titleCn: data.titleCn || "",
                youtubeUrl: data.youtubeUrl || "",
            });
            setVideoFile(null);
            setThumbnailFile(null);
        }
    }, [data, open]);

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

    const handleSubmit = async () => {
        // Basic validation
        // (Validation logic remains same)

        if (type === "upload") {
            if (videoFile) {
                if (!isValidVideoFile(videoFile)) {
                    toast.error("ไฟล์วิดีโอต้องเป็น MP4, WebM, OGG หรือ MOV เท่านั้น");
                    return;
                }
                if (videoFile.size > 1024 * 1024 * 1024) {
                    toast.error("ไฟล์วิดีโอต้องไม่เกิน 1GB");
                    return;
                }
            }

            if (thumbnailFile) {
                if (!isValidImageFile(thumbnailFile)) {
                    toast.error("รูปปกต้องเป็น JPG, PNG หรือ WebP เท่านั้น");
                    return;
                }
                if (thumbnailFile.size > 5 * 1024 * 1024) {
                    toast.error("รูปปกต้องไม่เกิน 5MB");
                    return;
                }
            }

            if (!data.videoUrl && !videoFile && data.youtubeUrl) {
                toast.error("กรุณาอัปโหลดวิดีโอ (เนื่องจากเดิมเป็นลิงก์ YouTube)");
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
            formData.append("id", data.id); // Important: Add ID
            formData.append("type", type);
            formData.append("titleTh", form.titleTh);
            formData.append("titleEn", form.titleEn);
            formData.append("titleCn", form.titleCn);

            if (type === "upload") {
                if (videoFile) formData.append("video", videoFile);
                if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
            } else {
                formData.append("youtubeUrl", form.youtubeUrl);
            }

            const res = await fetch(`/api/short-clips/${data.id}`, {
                method: "PUT",
                body: formData,
            });

            const resData = await res.json();

            if (!res.ok) throw new Error(resData.message || "เกิดข้อผิดพลาด");

            toast.success("แก้ไขคลิปสำเร็จ");
            setOpen(false);
            onSuccess && onSuccess();

        } catch (err) {
            console.error("Error updating clip:", err);
            toast.error(err.message || "เกิดข้อผิดพลาดในการแก้ไขคลิป");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>แก้ไข Short Clip</DialogTitle>
                    <DialogDescription className="hidden">Edit short clip details</DialogDescription>
                </DialogHeader>

                <Tabs value={type} onValueChange={setType}>
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

                        {/* Existing Info Display */}
                        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                            <strong>สถานะวิดีโอเดิม:</strong> {data?.videoUrl ? "มีไฟล์วิดีโอแล้ว" : "ไม่มี (ต้องอัปโหลด)"}
                        </div>

                        <div>
                            <Label htmlFor="video">เปลี่ยนวิดีโอ (ถ้าต้องการ)</Label>
                            <Input
                                id="video"
                                type="file"
                                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                            />
                            {videoFile && (
                                <p className="text-sm text-gray-500 mt-1">
                                    เลือกใหม่: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="thumbnail">เปลี่ยนรูปปก (ถ้าต้องการ)</Label>
                            <Input
                                id="thumbnail"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                            />
                            {thumbnailFile && (
                                <p className="text-sm text-gray-500 mt-1">
                                    เลือกใหม่: {thumbnailFile.name} ({(thumbnailFile.size / 1024).toFixed(2)} KB)
                                </p>
                            )}
                        </div>
                        <Button onClick={handleSubmit} disabled={loading} className="w-full">
                            {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
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
                        <Button onClick={handleSubmit} disabled={loading} className="w-full">
                            {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
