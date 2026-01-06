"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, LogOut, UserCircle } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }) {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <div className="flex items-start gap-8 max-w-5xl mx-auto">
      <aside className="w-64 sticky top-24 space-y-2">
        <ul className="space-y-1">
          <li>
            <Button
              asChild
              variant={isActive("/account") ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <a href="/account">
                <UserCircle className="size-4" />
                บัญชีของฉัน
              </a>
            </Button>
          </li>

          <li>
            <Button
              asChild
              variant={isActive("/account/articles") ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <a href="/account/articles">
                <FileText className="size-4" />
                บทความ
              </a>
            </Button>
          </li>
        </ul>

        <hr />

        <ul className="space-y-1">
          <li>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="w-full justify-start gap-2"
                  variant="ghost"
                //   onClick={() => signOut()}
                >
                  <LogOut className="size-4" />
                  ออกจากระบบ
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogTitle className="text-sm mb-4">
                  คุณต้องการออกจากระบบใช่หรือไม่?
                </DialogTitle>

                <DialogFooter className="flex justify-end gap-2">
                  <Button onClick={() => signOut()}>ออกจากระบบ</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </li>
        </ul>
      </aside>

      <main className="flex-1 min-h-screen">{children}</main>
    </div>
  );
}
