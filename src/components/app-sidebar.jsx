"use client";
import {
  Home,
  Briefcase,
  Users,
  BookOpen,
  Clock,
  Lightbulb,
  FileText,
  Star,
  Building,
  Phone,
  ChevronLeft,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(true);

  const menus = [
    { icon: Home, label: "หน้าแรก", href: "/" },
    { icon: Briefcase, label: "เปิดมุมคิดผู้บริหาร", href: "/categories/executive-thoughts" },
    { icon: Users, label: "สนทนาบนเส้นทางงาน", href: "/categories/career-path-conversations" },
    { icon: BookOpen, label: "งานวิจัยแนะนำ", href: "/categories/featured-research" },
    { icon: Clock, label: "สวนสุนันทาเมื่อวันวาน", href: "/categories/ssru-muea-wan" },
    { icon: Lightbulb, label: "มุมคิดวันนี้", href: "/categories/thoughts-today" },
    { icon: FileText, label: "สารคดีความรู้", href: "/categories/documentary-knowledge" },
    { icon: Star, label: "Hall of fame", href: "/categories/hall-of-fame" },
    { icon: Phone, label: "ติดต่อเรา", href: "/contact-us" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 flex flex-col items-center h-screen bg-white border-r border-[#F9FAFB] transition-all duration-300 ease-in-out z-50 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header with toggle */}
      <div className="flex h-20 items-center justify-between px-4 border-b border-[#F3F4F6]">
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-full transition-colors "
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        ) : (
          <>
            <button
              onClick={() => setCollapsed(true)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 w-full">
        <ul className="space-y-1 px-3">
          {menus.map((menu, index) => (
            <li key={index}>
              <Link href={menu.href}>
                <button
                  className={`cursor-pointer group relative flex w-full items-center rounded-md p-3 text-sm transition-all duration-300 hover:bg-gray-100 text-gray-700 ${
                    collapsed ? "justify-center" : ""
                  }`}
                >
                  <menu.icon
                    className={`h-5 w-5 shrink-0 text-gray-600 transition-all duration-300 `}
                  />
                  <span
                    className={`text-gray-700 font-normal whitespace-nowrap transition-all duration-300 flex justify-start ${
                      collapsed
                        ? "w-0 overflow-x-hidden opacity-0"
                        : "w-full opacity-100 ml-3"
                    }`}
                  >
                    {menu.label}
                  </span>
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
