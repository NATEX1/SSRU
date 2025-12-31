"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pencil, UserPlus, Eye, EyeOff } from "lucide-react";

export default function UserDialog({ children, user, onSuccess, mode = "edit" }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Initial state based on whether we are editing or creating
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "author",
        position: "",
        status: "active",
        password: "",
    });

    const isEdit = mode === "edit";

    // Reset form when dialog opens or user changes
    useEffect(() => {
        if (open) {
            if (isEdit && user) {
                setFormData({
                    name: user.name || "",
                    email: user.email || "",
                    role: user.role || "author",
                    position: user.position || "",
                    status: user.status || "active",
                    password: "",
                });
            } else {
                // Create mode
                setFormData({
                    name: "",
                    email: "",
                    role: "author",
                    position: "",
                    status: "active",
                    password: "",
                });
            }
        }
    }, [open, user, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/api/users/${user.id}` : "/api/users";
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
                    <DialogTitle>{isEdit ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้"}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "แก้ไขข้อมูลรายละเอียดของผู้ใช้"
                            : "เพิ่มผู้ใช้ใหม่เข้าสู่ระบบ"}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Name */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                ชื่อ-สกุล
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>

                        {/* Email (Readonly if edit) */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                อีเมล
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                รหัสผ่าน
                            </Label>
                            <div className="col-span-3 relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={isEdit ? "เว้นว่างไว้หากไม่ต้องการเปลี่ยน" : ""}
                                    required={!isEdit}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Position */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="position" className="text-right">
                                ตำแหน่ง
                            </Label>
                            <Input
                                id="position"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className="col-span-3"
                                placeholder="เช่น นักวิชาการศึกษา"
                            />
                        </div>

                        {/* Role */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                บทบาท
                            </Label>
                            <div className="col-span-3">
                                <Select
                                    value={formData.role}
                                    onValueChange={(val) => handleSelectChange("role", val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="เลือกบทบาท" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">ผู้ดูแลระบบ (Admin)</SelectItem>
                                        <SelectItem value="approver">ผู้อนุมัติ (Approver)</SelectItem>
                                        <SelectItem value="author">ผู้เขียน (Author)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                สถานะ
                            </Label>
                            <div className="col-span-3">
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => handleSelectChange("status", val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="เลือกสถานะ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">ใช้งานปกติ</SelectItem>
                                        <SelectItem value="inactive">ระงับการใช้งาน</SelectItem>
                                        <SelectItem value="suspended">แบน</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
