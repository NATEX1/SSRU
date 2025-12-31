
"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CategoryDialog({
    children,
    category,
    onSuccess,
    mode = "edit",
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        nameEn: "",
        nameCn: "",
        // Slug is auto-generated
    });

    const isEdit = mode === "edit";

    useEffect(() => {
        if (open) {
            if (isEdit && category) {
                setFormData({
                    name: category.name || "",
                    nameEn: category.nameEn || "",
                    nameCn: category.nameCn || "",
                });
            } else {
                setFormData({
                    name: "",
                    nameEn: "",
                    nameCn: "",
                });
            }
        }
    }, [open, category, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/api/categories/${category.id}` : "/api/categories";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Something went wrong");
            }

            setOpen(false);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "แก้ไขชื่อหมวดหมู่ในภาษาต่างๆ"
                            : "เพิ่มหมวดหมู่ใหม่เข้าสู่ระบบ"}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Thai Name */}
                        <div className="grid items-center gap-2">
                            <Label htmlFor="name">ชื่อหมวดหมู่ (ภาษาไทย) *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="เช่น ข่าวประชาสัมพันธ์"
                                required
                            />
                        </div>

                        {/* English Name */}
                        <div className="grid items-center gap-2">
                            <Label htmlFor="nameEn">Category Name (English)</Label>
                            <Input
                                id="nameEn"
                                name="nameEn"
                                value={formData.nameEn}
                                onChange={handleChange}
                                placeholder="e.g. PR News"
                            />
                            <p className="text-xs text-muted-foreground">
                                (ใช้สำหรับสร้างลิงก์ URL อัตโนมัติ)
                            </p>
                        </div>

                        {/* Chinese Name */}
                        <div className="grid items-center gap-2">
                            <Label htmlFor="nameCn">类别名称 (中文)</Label>
                            <Input
                                id="nameCn"
                                name="nameCn"
                                value={formData.nameCn}
                                onChange={handleChange}
                                placeholder="例如 公共关系新闻"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading ? "กำลังบันทึก..." : "บันทึก"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
