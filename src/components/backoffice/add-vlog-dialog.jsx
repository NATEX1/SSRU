"use client";

import React, { useState, useEffect } from "react";
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
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function AddVlogDialog({ onSuccess, totalCount = 0 }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        titleTh: "",
        titleEn: "",
        titleCn: "",
        youtubeUrl: "",
        order: 1,
    });

    // Fetch latest count when dialog opens
    useEffect(() => {
        if (open) {
            fetch("/api/vlog?limit=1")
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        setFormData(prev => ({ ...prev, order: (json.totalRecords || 0) + 1 }));
                    }
                })
                .catch(err => console.error("Fetch count error:", err));
        }
    }, [open]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            titleTh: "",
            titleEn: "",
            titleCn: "",
            youtubeUrl: "",
            order: totalCount + 1,
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const res = await fetch("/api/vlog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
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
                    <Plus className="w-4 h-4 mr-2" /> เพิ่ม Vlog
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>เพิ่ม Vlog</DialogTitle>
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
