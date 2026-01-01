import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function RejectDialog({ children, onSubmit }) {
  const [comment, setComment] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
        
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ไม่อนุมัติบทความ</DialogTitle>
          <DialogDescription>กรุณาระบุเหตุผลสำหรับผู้เขียน</DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="เหตุผลที่ไม่อนุมัติ..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">ยกเลิก</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => onSubmit(comment)}
            disabled={!comment.trim()}
          >
            ยืนยันไม่อนุมัติ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
