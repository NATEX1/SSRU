"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Save, Upload, User, Image as ImageIcon } from "lucide-react";

export default function EditorPage() {
    const slug = "editor-message";
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [data, setData] = useState({
        image: "",
        contentTh: "",
        contentEn: "",
        contentCn: "",
        nameTh: "",
        nameEn: "",
        nameCn: "",
        positionTh: "",
        positionEn: "",
        positionCn: "",
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/pages/${slug}`);
            const json = await res.json();
            if (json.success) {
                setData(json.data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("โหลดข้อมูลไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("image", file);

            const res = await fetch("/api/upload-image", {
                method: "POST",
                body: formData,
            });
            const json = await res.json();

            if (json.success === 1) {
                setData(prev => ({ ...prev, image: json.file.url }));
                toast.success("อัปโหลดรูปภาพสำเร็จ");
            } else {
                toast.error("อัปโหลดรูปภาพไม่สำเร็จ");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("เกิดข้อผิดพลาดในการอัปโหลด");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await fetch(`/api/pages/${slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (json.success) {
                toast.success("บันทึกข้อมูลสำเร็จ");
                setData(json.data);
            } else {
                throw new Error(json.message || "Unknown error");
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error("บันทึกข้อมูลไม่สำเร็จ: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">สารจากบรรณาธิการ</h1>
                    <p className="text-muted-foreground text-sm">จัดการเนื้อหาหน้าสารจากบรรณาธิการ (แบบคงที่)</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="rounded-full px-6 shadow-lg transition-all hover:scale-105 active:scale-95">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    บันทึกข้อมูล
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Image Section */}
                        <div className="lg:col-span-4 space-y-4">
                            <Label className="text-lg font-semibold flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-primary" />
                                รูปถ่ายบรรณาธิการ
                            </Label>
                            <div className="relative group aspect-[4/5] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary/50">
                                {data.image ? (
                                    <>
                                        <img
                                            src={data.image}
                                            alt="Editor"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <Label htmlFor="image-upload" className="cursor-pointer bg-white text-black px-4 py-2 rounded-full font-medium shadow-lg hover:bg-gray-100 flex items-center gap-2">
                                                <Upload className="w-4 h-4" /> เปลี่ยนรูป
                                            </Label>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6 flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                                            <Upload className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">ยังไม่มีรูปภาพ</p>
                                            <p className="text-sm text-muted-foreground">คลิกเพื่ออัปโหลดรูปแนวตั้ง (4:5)</p>
                                        </div>
                                        <Label htmlFor="image-upload" className="cursor-pointer mt-2 bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium shadow-lg hover:opacity-90 transition-opacity">
                                            เลือกไฟล์รูป
                                        </Label>
                                    </div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    </div>
                                )}
                                <input
                                    id="image-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="lg:col-span-8 flex flex-col">
                            <Tabs defaultValue="th" className="w-full h-full flex flex-col">
                                <div className="bg-gray-50 p-1 rounded-xl w-fit self-end mb-6">
                                    <TabsList className="bg-transparent">
                                        <TabsTrigger value="th" className="rounded-lg px-4">TH</TabsTrigger>
                                        <TabsTrigger value="en" className="rounded-lg px-4">EN</TabsTrigger>
                                        <TabsTrigger value="cn" className="rounded-lg px-4">CN</TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="th" className="space-y-6 animate-in fade-in slide-in-from-right-2">
                                    <div className="space-y-2">
                                        <Label className="text-base font-semibold">ข้อความสารจากบรรณาธิการ (TH)</Label>
                                        <Textarea
                                            value={data.contentTh || ""}
                                            onChange={(e) => setData({ ...data, contentTh: e.target.value })}
                                            placeholder="พิมพ์ข้อความที่นี่..."
                                            className="min-h-[250px] resize-none border-gray-200 focus:ring-primary/20 text-base leading-relaxed"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="font-semibold">ชื่อ (TH)</Label>
                                            <Input
                                                value={data.nameTh || ""}
                                                onChange={(e) => setData({ ...data, nameTh: e.target.value })}
                                                placeholder="ชื่อ-นามสกุล"
                                                className="border-gray-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-semibold">ตำแหน่ง (TH)</Label>
                                            <Input
                                                value={data.positionTh || ""}
                                                onChange={(e) => setData({ ...data, positionTh: e.target.value })}
                                                placeholder="ตำแหน่งงาน"
                                                className="border-gray-200"
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="en" className="space-y-6 animate-in fade-in slide-in-from-right-2">
                                    <div className="space-y-2">
                                        <Label className="text-base font-semibold">Editor's Message (EN)</Label>
                                        <Textarea
                                            value={data.contentEn || ""}
                                            onChange={(e) => setData({ ...data, contentEn: e.target.value })}
                                            placeholder="Type message here..."
                                            className="min-h-[250px] resize-none border-gray-200 focus:ring-primary/20 text-base leading-relaxed"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="font-semibold">Name (EN)</Label>
                                            <Input
                                                value={data.nameEn || ""}
                                                onChange={(e) => setData({ ...data, nameEn: e.target.value })}
                                                placeholder="Full Name"
                                                className="border-gray-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-semibold">Position (EN)</Label>
                                            <Input
                                                value={data.positionEn || ""}
                                                onChange={(e) => setData({ ...data, positionEn: e.target.value })}
                                                placeholder="Job Title"
                                                className="border-gray-200"
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="cn" className="space-y-6 animate-in fade-in slide-in-from-right-2">
                                    <div className="space-y-2">
                                        <Label className="text-base font-semibold">主编致辞 (CN)</Label>
                                        <Textarea
                                            value={data.contentCn || ""}
                                            onChange={(e) => setData({ ...data, contentCn: e.target.value })}
                                            placeholder="在这里输入信息..."
                                            className="min-h-[250px] resize-none border-gray-200 focus:ring-primary/20 text-base leading-relaxed"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="font-semibold">姓名 (CN)</Label>
                                            <Input
                                                value={data.nameCn || ""}
                                                onChange={(e) => setData({ ...data, nameCn: e.target.value })}
                                                placeholder="姓名"
                                                className="border-gray-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-semibold">职位 (CN)</Label>
                                            <Input
                                                value={data.positionCn || ""}
                                                onChange={(e) => setData({ ...data, positionCn: e.target.value })}
                                                placeholder="职位"
                                                className="border-gray-200"
                                            />
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
