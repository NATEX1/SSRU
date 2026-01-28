"use client";

import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import Link from "next/link";
import {
  FileText,
  Film,
  Group,
  Home,
  Layers,
  LogOut,
  Settings,
  User2,
  UserCircle,
  Users,
  Video,
  BookOpen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

export default function DashboardSidebar() {
  const { open } = useSidebar();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/me");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("fetch user error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [status]);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const res = await fetch("/api/articles/pending-count");
        const json = await res.json();
        if (json.success) {
          setPendingCount(json.count);
        }
      } catch (error) {
        console.error("fetch pending count error:", error);
      }
    };

    fetchPendingCount();
  }, []);

  const menus = [
    {
      name: "ทั่วไป",
      items: [
        {
          label: "หน้าแรก",
          icon: Home,
          href: "/backoffice",
        },
        {
          label: "จัดการผู้ใช้ในระบบ",
          icon: Users,
          href: "/backoffice/users",
        },
        {
          label: "จัดการบทความ",
          icon: FileText,
          href: "/backoffice/articles",
        },
        {
          label: "จัดการหมวดหมู่",
          icon: Layers,
          href: "/backoffice/categories",
        },
        {
          label: "Short Clips",
          icon: Film,
          href: "/backoffice/short-clips",
        },
        {
          label: "SSRU Around",
          icon: BookOpen,
          href: "/backoffice/ssru-around",
        },
        {
          label: "Vlog",
          icon: Film,
          href: "/backoffice/vlog",
        },
        {
          label: "สารจากบรรณาธิการ",
          icon: BookOpen,
          href: "/backoffice/etidtor",
        },
        {
          label: "เกณฑ์การส่งบทความ",
          icon: BookOpen,
          href: "/backoffice/criteria",
        },
        {
          label: "ตั้งค่า",
          icon: Settings,
          href: "/backoffice/settings/account",
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon">
      {/* <SidebarHeader>
        {open && <div className="text-4xl font-bold">LOGO</div>}
      </SidebarHeader> */}

      <SidebarContent>
        {menus.map((group, idx) => (
          <SidebarGroup key={idx}>
            <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items
                  .filter((item) => {
                    if (!user) return false;
                    if (user.role === "admin") return true;
                    if (user.role === "approver") {
                      return ["หน้าแรก", "จัดการบทความ", "Short Clips", "SSRU Around"].includes(item.label);
                    }
                    if (user.role === "author") {
                      return ["หน้าแรก", "จัดการบทความ", "ตั้งค่า"].includes(item.label);
                    }
                    return false;
                  })
                  .map((item, i) => (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuButton asChild>
                        <Link href={item.href} className="justify-between">
                          <div className="flex items-center gap-2">
                            <item.icon /> {item.label}
                          </div>
                          {item.label === "จัดการบทความ" && pendingCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {pendingCount}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className={"border-t border-sidebar-accent"}>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Avatar className={"dark"}>
              {user && user.image ? (
                <AvatarImage src={user.image} />
              ) : (
                <AvatarFallback>
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              )}
            </Avatar>

            {open && user?.name}
          </div>

          {open && (
            <Dialog>
              <DialogTrigger asChild>
                <button className="px-2 py-1 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                </button>
              </DialogTrigger>

              <DialogContent>
                <DialogTitle className="text-sm mb-4">คุณต้องการออกจากระบบใช่หรือไม่?</DialogTitle>

                <DialogFooter className="flex justify-end gap-2">
                  <Button
                    onClick={() => signOut({ callbackUrl: "/signin" })}
                  >
                    ออกจากระบบ
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
