"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";

export default function AddSsruAroundDialog({ onSuccess }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState({
        th: null,
        en: null,
        cn: null,
    });
    const [imagePreviews, setImagePreviews] = useState({
        th: null,
        en: null,
        cn: null,
    });
    const [formData, setFormData] = useState({
        titleTh: "",
        titleEn: "",
        titleCn: "",
        issue: "",
        year: "",
        link: "",
        type: "Digital Version Available",
        order: 1,
    });

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e, lang) => {
        const file = e.target.files[0];
        if (file) {
            setImageFiles((prev) => ({ ...prev, [lang]: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => ({ ...prev, [lang]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setFormData({
            titleTh: "",
            titleEn: "",
            titleCn: "",
            issue: "",
            year: "",
            link: "",
            type: "Digital Version Available",
            order: 1,
        });
        setImageFiles({ th: null, en: null, cn: null });
        setImagePreviews({ th: null, en: null, cn: null });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                data.append(key, formData[key]);
            });
            if (imageFiles.th) data.append("imageTh", imageFiles.th);
            if (imageFiles.en) data.append("imageEn", imageFiles.en);
            if (imageFiles.cn) data.append("imageCn", imageFiles.cn);

            const res = await fetch("/api/ssru-around", {
                method: "POST",
                body: data,
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "เกิดข้อผิดพลาด");

            toast.success("เพิ่มข้อมูลสำเร็จ");
            setOpen(false);
            resetForm();
            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-full px-6">
                    <Plus className="w-4 h-4 mr-2" /> เพิ่ม SSRU Around
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>เพิ่ม SSRU Around</DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <Tabs defaultValue="th" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="th">ภาษาไทย</TabsTrigger>
                            <TabsTrigger value="en">English</TabsTrigger>
                            <TabsTrigger value="cn">中文 (Chinese)</TabsTrigger>
                        </TabsList>

                        {/* Thai Content */}
                        <TabsContent value="th" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>หัวข้อ (Title TH)</Label>
                                <Input
                                    name="titleTh"
                                    value={formData.titleTh}
                                    onChange={onChange}
                                    placeholder="เช่น รอบรั้วแก้วเจ้าจอม (วันที่ 1-8 ม.ค. 69)"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>รูปหน้าปก (Cover Image TH)</Label>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="relative size-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors bg-muted/50 overflow-hidden"
                                        onClick={() => document.getElementById("around-image-th").click()}
                                    >
                                        {imagePreviews.th ? (
                                            <img src={imagePreviews.th} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                                                <span className="text-[10px] text-muted-foreground text-center px-2">
                                                    อัปโหลดรูป (TH)
                                                </span>
                                            </>
                                        )}
                                        <input
                                            id="around-image-th"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleImageChange(e, "th")}
                                        />
                                    </div>
                                    {imagePreviews.th && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="rounded-full size-8"
                                            onClick={() => {
                                                setImageFiles(prev => ({ ...prev, th: null }));
                                                setImagePreviews(prev => ({ ...prev, th: null }));
                                            }}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* English Content */}
                        <TabsContent value="en" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>หัวข้อ (Title EN)</Label>
                                <Input
                                    name="titleEn"
                                    value={formData.titleEn}
                                    onChange={onChange}
                                    placeholder="e.g. Suan Sunandha Around"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>รูปหน้าปก (Cover Image EN)</Label>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="relative size-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors bg-muted/50 overflow-hidden"
                                        onClick={() => document.getElementById("around-image-en").click()}
                                    >
                                        {imagePreviews.en ? (
                                            <img src={imagePreviews.en} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                                                <span className="text-[10px] text-muted-foreground text-center px-2">
                                                    Upload Image (EN)
                                                </span>
                                            </>
                                        )}
                                        <input
                                            id="around-image-en"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleImageChange(e, "en")}
                                        />
                                    </div>
                                    {imagePreviews.en && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="rounded-full size-8"
                                            onClick={() => {
                                                setImageFiles(prev => ({ ...prev, en: null }));
                                                setImagePreviews(prev => ({ ...prev, en: null }));
                                            }}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* Chinese Content */}
                        <TabsContent value="cn" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>หัวข้อ (Title CN)</Label>
                                <Input
                                    name="titleCn"
                                    value={formData.titleCn}
                                    onChange={onChange}
                                    placeholder="例如 宣素那他园里"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>รูปหน้าปก (Cover Image CN)</Label>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="relative size-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors bg-muted/50 overflow-hidden"
                                        onClick={() => document.getElementById("around-image-cn").click()}
                                    >
                                        {imagePreviews.cn ? (
                                            <img src={imagePreviews.cn} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                                                <span className="text-[10px] text-muted-foreground text-center px-2">
                                                    上传图片 (CN)
                                                </span>
                                            </>
                                        )}
                                        <input
                                            id="around-image-cn"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleImageChange(e, "cn")}
                                        />
                                    </div>
                                    {imagePreviews.cn && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="rounded-full size-8"
                                            onClick={() => {
                                                setImageFiles(prev => ({ ...prev, cn: null }));
                                                setImagePreviews(prev => ({ ...prev, cn: null }));
                                            }}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div className="space-y-2">
                            <Label>ฉบับที่ (Issue)</Label>
                            <Input
                                name="issue"
                                value={formData.issue}
                                onChange={onChange}
                                placeholder="เช่น Issue 12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>ปี (Year)</Label>
                            <Input
                                name="year"
                                value={formData.year}
                                onChange={onChange}
                                placeholder="เช่น 2026"
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label>ลิงก์ FlipHTML (Link)</Label>
                            <Input
                                name="link"
                                value={formData.link}
                                onChange={onChange}
                                placeholder="เช่น https://online.fliphtml5.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>ประเภท (Type)</Label>
                            <Input
                                name="type"
                                value={formData.type}
                                onChange={onChange}
                                placeholder="เช่น Digital Version Available"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>ลำดับการแสดงผล (Order)</Label>
                            <Input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={onChange}
                                min="1"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            ยกเลิก
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "กำลังบันทึก..." : "บันทึก"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
