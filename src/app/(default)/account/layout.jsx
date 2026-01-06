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
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-8 items-start">
        <aside className="lg:sticky lg:top-24">
          {/* Mobile/Tablet: Tabs */}
          <div className="lg:hidden">
            <div className="bg-white border rounded-2xl p-2 shadow-sm">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  asChild
                  variant={isActive("/account") ? "secondary" : "ghost"}
                  className="justify-start gap-2 rounded-xl"
                >
                  <a href="/account">
                    <UserCircle className="size-4" />
                    บัญชี
                  </a>
                </Button>

                <Button
                  asChild
                  variant={isActive("/account/articles") ? "secondary" : "ghost"}
                  className="justify-start gap-2 rounded-xl"
                >
                  <a href="/account/articles">
                    <FileText className="size-4" />
                    บทความ
                  </a>
                </Button>
              </div>

              <div className="mt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 rounded-xl text-red-600 hover:text-red-600"
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
              </div>
            </div>
          </div>

          {/* Desktop: Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-white border rounded-2xl p-3 shadow-sm">
              <div className="text-sm font-semibold text-[#101828] px-2 py-2">
                เมนูบัญชี
              </div>

              <div className="space-y-1">
                <Button
                  asChild
                  variant={isActive("/account") ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2 rounded-xl"
                >
                  <a href="/account">
                    <UserCircle className="size-4" />
                    บัญชีของฉัน
                  </a>
                </Button>

                <Button
                  asChild
                  variant={isActive("/account/articles") ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2 rounded-xl"
                >
                  <a href="/account/articles">
                    <FileText className="size-4" />
                    บทความ
                  </a>
                </Button>
              </div>

              <div className="my-3 border-t" />

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 rounded-xl text-red-600 hover:text-red-600"
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
            </div>
          </div>
        </aside>

        {/* =================== CONTENT =================== */}
        <main className="min-h-[calc(100vh-64px)]">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>

  );
}
