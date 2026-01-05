import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export default function page() {
  return (
    <div>
      <div className="pb-4 border-b mb-8">
        <h2 className="font-bold text-3xl">บัญชีของฉัน</h2>
        <p className="text-muted-foreground">จัดการข้อมูลพื้นฐานของเว็บไซต์</p>
      </div>

      <div className="flex gap-6 mb-8">
        <div className="w-64 pt-2">
          <Label>Social Links</Label>
        </div>

        <div className="flex-1 space-y-2">
          <div>
            <Label className="text-xs text-muted-foreground">Youtube</Label>
            <Input name="facebook" type="url" />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Facebook</Label>
            <Input name="facebook" type="url" />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">X (Twitter)</Label>
            <Input name="x" type="url" />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">LINE</Label>
            <Input name="line" type="url" />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Instagram</Label>
            <Input name="instagram" type="url" />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Tiktok</Label>
            <Input name="instagram" type="url" />
          </div>
        </div>
      </div>
    </div>
  );
}
