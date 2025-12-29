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
  Group,
  Home,
  Layers,
  LogOut,
  Settings,
  User2,
  UserCircle,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function DashboardSidebar() {
  const { open } = useSidebar();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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
          label: 'จัดการหมวดหมู่',
          icon: Layers,
          href: '/backoffice/categories'
        }
      ],
    },
    {
      name: "ตั้งค่า",
      items: [
        {
          label: "บัญชีของฉัน",
          icon: UserCircle,
          href: "/backoffice/account",
        },
        {
          label: "ตั้งค่า",
          icon: Settings,
          href: "/backoffice/settings",
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
                {group.items.map((item, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href}>
                        <item.icon /> {item.label}
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
            <button className="px-2 py-1 cursor-pointer">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
