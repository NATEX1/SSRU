import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Calendar as CalendarIcon } from "lucide-react";

export default function ApproveDialog({ children, onApprove }) {
  const getNextMondayDate = () => {
    const today = new Date();
    const resultDate = new Date(today.getTime());
    resultDate.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7 || 7));
    return resultDate;
  };

  const initialDate = getNextMondayDate();
  const [day, setDay] = useState(initialDate.getDate());
  const [month, setMonth] = useState(initialDate.getMonth() + 1); // 1-12
  const [year, setYear] = useState(initialDate.getFullYear() + 543); // Thai BE

  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() + 543 + i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleConfirm = () => {
    // Convert back to AD for API
    const adYear = year - 543;
    const dateStr = `${adYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onApprove(dateStr);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#3F458D] font-bold">ยืนยันการอนุมัติและตั้งค่าเผยแพร่</AlertDialogTitle>
          <AlertDialogDescription>
            กรุณาเลือกวันที่ต้องการเผยแพร่บทความนี้ (พ.ศ.)
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-8">
          <div className="flex gap-2">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-bold text-gray-500">วัน</label>
              <select
                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#F06FAA]/20"
                value={day}
                onChange={(e) => setDay(parseInt(e.target.value))}
              >
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex-[2] space-y-1.5">
              <label className="text-xs font-bold text-gray-500">เดือน</label>
              <select
                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#F06FAA]/20"
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
              >
                {thaiMonths.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-bold text-gray-500">ปี พ.ศ.</label>
              <select
                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#F06FAA]/20"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel className="rounded-xl border-gray-200">ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#3F458D] hover:bg-[#3F458D]/90 rounded-xl px-8"
            onClick={handleConfirm}
          >
            อนุมัติบทความ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
