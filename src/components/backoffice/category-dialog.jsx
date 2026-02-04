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
import * as LucideIcons from "lucide-react";

const ICON_LIST = [
  "Home", "Briefcase", "Users", "BookOpen", "Clock", "Lightbulb", "FileText", "Star",
  "Phone", "Info", "HelpCircle", "Settings", "Bell", "Calendar", "Camera", "Heart",
  "Mail", "Map", "MessageCircle", "Music", "Play", "Search", "ShoppingCart", "Video",
  "Award", "Bookmark", "Coffee", "Globe", "Image", "Layout", "Link", "List", "Lock",
  "MapPin", "Mic", "Moon", "Paperclip", "PenTool", "Printer", "Rocket", "Shield",
  "Smile", "Sun", "Tag", "ThumbsUp", "Trash", "Truck", "Tv", "Umbrella", "Zap"
];

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
    icon: "",
  });

  const isEdit = mode === "edit";

  useEffect(() => {
    if (open) {
      if (isEdit && category) {
        setFormData({
          name: category.name || "",
          nameEn: category.nameEn || "",
          nameCn: category.nameCn || "",
          icon: category.icon || "",
        });
      } else {
        setFormData({
          name: "",
          nameEn: "",
          nameCn: "",
          icon: "FileText", // Default icon
        });
      }
    }
  }, [open, category, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIconSelect = (iconName) => {
    setFormData((prev) => ({ ...prev, icon: iconName }));
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
              ? "แก้ไขชื่อหมวดหมู่ในภาษาต่างๆ และไอคอน"
              : "เพิ่มหมวดหมู่ใหม่เข้าสู่ระบบ"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
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

            {/* Icon Picker */}
            <div className="grid items-center gap-2">
              <Label>เลือกไอคอน</Label>
              <div className="grid grid-cols-8 gap-2 border p-2 rounded-md max-h-[200px] overflow-y-auto">
                {ICON_LIST.map((iconName) => {
                  const Icon = LucideIcons[iconName];
                  if (!Icon) return null;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => handleIconSelect(iconName)}
                      className={`p-2 rounded-md transition-all flex items-center justify-center border
                        ${formData.icon === iconName
                          ? "bg-blue-50 border-blue-500 text-blue-500 shadow-sm"
                          : "hover:bg-gray-100 border-transparent text-gray-600"
                        }`}
                      title={iconName}
                    >
                      <Icon size={20} />
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">ไอคอนที่เลือก: {formData.icon}</p>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={loading}>
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

