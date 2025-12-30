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
  Phone,
  ChevronLeft,
  Menu,
  SquarePen,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const pathname = usePathname();

  // desktop collapse
  const [collapsed, setCollapsed] = useState(true);

  // mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);

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
    { icon: SquarePen, label: "เขียนบทความ", href: "/write" },
  ];

  // ปิด drawer เมื่อเปลี่ยนหน้า (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ล็อก scroll ตอน drawer เปิด (mobile)
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const SidebarList = ({ isDesktop }) => (
    <nav className="flex-1 overflow-y-auto py-4">
      <ul className="space-y-1 px-3">
        {menus.map((menu, index) => {
          const Icon = menu.icon;
          const active = pathname === menu.href || pathname?.startsWith(menu.href + "/");

          return (
            <li key={index}>
              <Link
                href={menu.href}
                className={`group relative flex items-center rounded-md p-3 text-sm transition hover:bg-gray-100
                  ${active ? "bg-gray-100 text-gray-900" : "text-gray-700"}
                  ${isDesktop && collapsed ? "justify-center" : ""}`}
                onClick={() => {
                  if (!isDesktop) setMobileOpen(false);
                }}
              >
                <Icon className="h-5 w-5 shrink-0 text-gray-600" />
                <span
                  className={`ml-3 whitespace-nowrap transition-all duration-200
                    ${isDesktop && collapsed ? "w-0 overflow-hidden opacity-0 ml-0" : "opacity-100"}`}
                >
                  {menu.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="lg:hidden fixed top-4 left-4 z-[90] p-2 bg-white border border-[#F3F4F6] rounded-full shadow-sm hover:bg-gray-50"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? (
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        ) : (
          <Menu className="h-5 w-5 text-gray-700" />
        )}
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}`}
      >
        <div className="flex flex-col h-full bg-white border-r border-[#F3F4F6]">
          <div className="w-full h-20 flex items-center justify-between px-4 border-b border-[#F3F4F6]">
            {collapsed ? (
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-full"
                aria-label="Expand sidebar"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="p-2 hover:bg-gray-100 rounded-md"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
            )}
          </div>

          <SidebarList isDesktop />
        </div>
      </aside>

      {/* Mobile Drawer + overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[80]"
          onClick={() => setMobileOpen(false)} 
        >
          {/* overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* drawer */}
          <aside
            className="absolute top-0 left-0 h-full w-72 max-w-[85vw] bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="h-20 border-b border-[#F3F4F6]" />
            <SidebarList isDesktop={false} />
          </aside>
        </div>
      )}

      {/* Spacer desktop */}
      <div className={`hidden lg:block ${collapsed ? "w-20" : "w-64"}`} />
    </>
  );
}
