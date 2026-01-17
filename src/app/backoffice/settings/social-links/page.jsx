"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [links, setLinks] = useState({
    facebook: "",
    youtube: "",
    twitter: "",
    line: "",
    instagram: "",
    tiktok: "",
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/social-links");
      const data = await res.json();
      setLinks((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/social-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(links),
      });

      if (res.ok) {
        toast.success("บันทึกข้อมูลสำเร็จ");
      } else {
        toast.error("บันทึกข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="pb-4 border-b mb-8 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-3xl">Social Links</h2>
          <p className="text-muted-foreground">จัดการลิงก์โซเชียลมีเดียของเว็บไซต์</p>
        </div>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          บันทึกการเปลี่ยนแปลง
        </Button>
      </div>

      <div className="flex gap-6 mb-8">
        <div className="w-64 pt-2">
          <Label>ช่องทางติดต่อ</Label>
        </div>

        <div className="flex-1 space-y-4 max-w-xl">
          <div>
            <Label className="text-xs text-muted-foreground">YouTube</Label>
            <Input
              name="youtube"
              type="url"
              placeholder="https://youtube.com/..."
              value={links.youtube}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Facebook</Label>
            <Input
              name="facebook"
              type="url"
              placeholder="https://facebook.com/..."
              value={links.facebook}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">X (Twitter)</Label>
            <Input
              name="twitter"
              type="url"
              placeholder="https://x.com/..."
              value={links.twitter}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">LINE</Label>
            <Input
              name="line"
              type="url"
              placeholder="https://line.me/..."
              value={links.line}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Instagram</Label>
            <Input
              name="instagram"
              type="url"
              placeholder="https://instagram.com/..."
              value={links.instagram}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">TikTok</Label>
            <Input
              name="tiktok"
              type="url"
              placeholder="https://tiktok.com/..."
              value={links.tiktok}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
