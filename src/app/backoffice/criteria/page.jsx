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
import { Loader2, Save, FileText } from "lucide-react";

export default function CriteriaPage() {
    const slug = "submission-criteria";
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState({
        titleTh: "เกณฑ์ในการส่งบทความ",
        titleEn: "Submission Criteria",
        titleCn: "提交标准",
        contentTh: "",
        contentEn: "",
        contentCn: "",
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/pages/${slug}`);
            const json = await res.json();
            if (json.success) {
                // Merge with default titles if empty
                setData(prev => ({
                    ...prev,
                    ...json.data,
                    titleTh: json.data.titleTh || prev.titleTh,
                    titleEn: json.data.titleEn || prev.titleEn,
                    titleCn: json.data.titleCn || prev.titleCn,
                }));
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
                    <h1 className="text-2xl font-bold">เกณฑ์การส่งบทความ</h1>
                    <p className="text-muted-foreground text-sm">จัดการเนื้อหาหน้าเกณฑ์การส่งบทความ (แบบข้อความ)</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="rounded-full px-6 shadow-lg transition-all hover:scale-105 active:scale-95">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    บันทึกข้อมูล
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8">
                    <Tabs defaultValue="th" className="w-full">
                        <div className="flex justify-between items-center mb-8">
                            <Label className="text-lg font-semibold flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                เนื้อหาเกณฑ์การส่งบทความ
                            </Label>
                            <div className="bg-gray-50 p-1 rounded-xl">
                                <TabsList className="bg-transparent">
                                    <TabsTrigger value="th" className="rounded-lg px-4">TH</TabsTrigger>
                                    <TabsTrigger value="en" className="rounded-lg px-4">EN</TabsTrigger>
                                    <TabsTrigger value="cn" className="rounded-lg px-4">CN</TabsTrigger>
                                </TabsList>
                            </div>
                        </div>

                        <TabsContent value="th" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <div className="space-y-2">
                                <Label className="text-base font-semibold">หัวข้อหลัก (TH)</Label>
                                <Input
                                    value={data.titleTh || ""}
                                    onChange={(e) => setData({ ...data, titleTh: e.target.value })}
                                    placeholder="เช่น เกณฑ์ในการส่งบทความ"
                                    className="border-gray-200 focus:ring-primary/20 text-lg font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-base font-semibold">รายละเอียดเกณฑ์ (TH)</Label>
                                <Textarea
                                    value={data.contentTh || ""}
                                    onChange={(e) => setData({ ...data, contentTh: e.target.value })}
                                    placeholder="ใส่ข้อความเกณฑ์การส่งบทความลำดับที่ 1.. 2.. 3.."
                                    className="min-h-[400px] resize-none border-gray-200 focus:ring-primary/20 text-base leading-relaxed"
                                />
                                <p className="text-xs text-muted-foreground mt-1">เคล็ดลับ: คุณสามารถใส่เลขลำดับ 1. 2. 3. นำหน้าข้อความเพื่อให้ดูเหมือนในตัวอย่าง</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="en" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <div className="space-y-2">
                                <Label className="text-base font-semibold">Main Title (EN)</Label>
                                <Input
                                    value={data.titleEn || ""}
                                    onChange={(e) => setData({ ...data, titleEn: e.target.value })}
                                    placeholder="e.g., Submission Criteria"
                                    className="border-gray-200 focus:ring-primary/20 text-lg font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-base font-semibold">Criteria Details (EN)</Label>
                                <Textarea
                                    value={data.contentEn || ""}
                                    onChange={(e) => setData({ ...data, contentEn: e.target.value })}
                                    placeholder="Type details here..."
                                    className="min-h-[400px] resize-none border-gray-200 focus:ring-primary/20 text-base leading-relaxed"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="cn" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <div className="space-y-2">
                                <Label className="text-base font-semibold">主标题 (CN)</Label>
                                <Input
                                    value={data.titleCn || ""}
                                    onChange={(e) => setData({ ...data, titleCn: e.target.value })}
                                    placeholder="例如：提交标准"
                                    className="border-gray-200 focus:ring-primary/20 text-lg font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-base font-semibold">标准详情 (CN)</Label>
                                <Textarea
                                    value={data.contentCn || ""}
                                    onChange={(e) => setData({ ...data, contentCn: e.target.value })}
                                    placeholder="在此输入详情..."
                                    className="min-h-[400px] resize-none border-gray-200 focus:ring-primary/20 text-base leading-relaxed"
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
