"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { data: session } = useSession();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">ยินดีต้อนรับเข้าสู่ระบบจัดการหลังบ้าน</h1>

      {session ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
          <p className="text-lg">สวัสดี, <span className="font-semibold text-primary">{session.user?.name}</span></p>
          <p className="text-gray-500">
            สถานะของคุณคือ: <span className="font-medium bg-gray-100 px-2 py-1 rounded">{session.user?.role}</span>
          </p>

          <div className="pt-4 flex gap-4">
            <Button asChild>
              <Link href="/backoffice/articles">จัดการบทความ</Link>
            </Button>
            {/* Show Users button only for admin */}
            {session.user?.role === 'admin' && (
              <Button variant="outline" asChild>
                <Link href="/backoffice/users">จัดการผู้ใช้งาน</Link>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div>Loading session...</div>
      )}
    </div>
  );
}
