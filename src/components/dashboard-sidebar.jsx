"use client";

import React from "react";
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
import { FileText, Home, LogOut, User2, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";

export default function DashboardSidebar() {
  const { open } = useSidebar();
  const { data: session } = useSession();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {open && <div className="text-4xl font-bold">LOGO</div>}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={"/backoffice"}>
                    <Home /> หน้าแรก
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={"/backoffice/users"}>
                    <User2 /> ผู้ใช้ในระบบ
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={"/backoffice/articles"}>
                    <FileText /> บทความ
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-64">
                <DropdownMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href={"/backoffice/account"}>
                      <UserCircle /> บัญชี
                    </Link>
                  </SidebarMenuButton>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <SidebarMenuButton
                    onClick={() => signOut({ callbackUrl: "/signin" })}
                  >
                    <LogOut /> ออกจากระบบ
                  </SidebarMenuButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
