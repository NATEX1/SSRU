import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div >
      {/* Header */}
      <div className="pb-4 border-b mb-8">
        <h2 className="font-bold text-3xl">Site Settings</h2>
        <p className="text-muted-foreground">
          จัดการข้อมูลพื้นฐานของเว็บไซต์
        </p>
      </div>

      {/* Site name */}
      <div className="flex gap-6 mb-6">
        <div className="w-64 pt-2">
          <Label>Site Name</Label>
        </div>
        <div className="flex-1">
          <Input placeholder="ชื่อเว็บไซต์" />
        </div>
      </div>

      {/* Footer text */}
      <div className="flex gap-6 mb-6">
        <div className="w-64 pt-2">
          <Label>Footer Text</Label>
        </div>
        <div className="flex-1">
          <Textarea rows={4} placeholder="ข้อความด้านล่างเว็บไซต์" />
        </div>
      </div>

      {/* Email */}
      <div className="flex gap-6 mb-6">
        <div className="w-64 pt-2">
          <Label>E-mail</Label>
        </div>
        <div className="flex-1">
          <Input type="email" placeholder="contact@domain.com" />
        </div>
      </div>

      {/* Address */}
      <div className="flex gap-6 mb-8">
        <div className="w-64 pt-2">
          <Label>Address</Label>
        </div>
        <div className="flex-1">
          <Textarea rows={4} placeholder="ที่อยู่หน่วยงาน" />
        </div>
      </div>

      {/* Action */}
      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
