"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { toast } from "sonner";

export default function EditVlogDialog({ vlog, open, setOpen, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        titleTh: "",
        titleEn: "",
        titleCn: "",
        youtubeUrl: "",
        order: 1,
    });

    useEffect(() => {
        if (vlog) {
            setFormData({
                titleTh: vlog.titleTh || "",
                titleEn: vlog.titleEn || "",
                titleCn: vlog.titleCn || "",
                youtubeUrl: vlog.youtubeUrl || "",
                order: vlog.order || 1,
            });
        }
    }, [vlog]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const res = await fetch(`/api/vlog/${vlog.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "เกิดข้อผิดพลาด");

            toast.success("แก้ไขข้อมูลสำเร็จ");
            setOpen(false);
            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>แก้ไข Vlog</DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <Tabs defaultValue="th" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="th">ภาษาไทย</TabsTrigger>
                            <TabsTrigger value="en">English</TabsTrigger>
                            <TabsTrigger value="cn">中文 (Chinese)</TabsTrigger>
                        </TabsList>

                        <TabsContent value="th" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>หัวข้อ (Title TH)</Label>
                                <Input
                                    name="titleTh"
                                    value={formData.titleTh}
                                    onChange={onChange}
                                    placeholder="เช่น แนะนำมหาวิทยาลัย"
                                    required
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="en" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>หัวข้อ (Title EN)</Label>
                                <Input
                                    name="titleEn"
                                    value={formData.titleEn}
                                    onChange={onChange}
                                    placeholder="e.g. University Introduction"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="cn" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>หัวข้อ (Title CN)</Label>
                                <Input
                                    name="titleCn"
                                    value={formData.titleCn}
                                    onChange={onChange}
                                    placeholder="例如 大学介绍"
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                            <Label>YouTube URL</Label>
                            <Input
                                name="youtubeUrl"
                                value={formData.youtubeUrl}
                                onChange={onChange}
                                placeholder="เช่น https://www.youtube.com/watch?v=..."
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
