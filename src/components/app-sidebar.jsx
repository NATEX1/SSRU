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
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const pathname = usePathname();

  // desktop collapse
  const [collapsed, setCollapsed] = useState(true);

  // mobile drawer open/close
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

  // ปิด drawer เมื่อเปลี่ยนหน้า (มือถือ)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ล็อกการ scroll 
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const SidebarContent = ({ isDesktop }) => (
    <div className="flex flex-col h-full bg-white border-r border-[#F3F4F6]">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[#F3F4F6]">
        {/* Mobile: ปุ่มปิด */}
        {!isDesktop ? (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        ) : (
          // Desktop: toggle collapse
          <>
            {collapsed ? (
              <button
                onClick={() => setCollapsed(false)}
                className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Expand sidebar"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
            ) : (
              <button
                onClick={() => setCollapsed(true)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menus.map((menu, index) => {
            const active = pathname === menu.href || pathname?.startsWith(menu.href + "/");
            const Icon = menu.icon;

            return (
              <li key={index}>
                <Link
                  href={menu.href}
                  className={`group relative flex items-center rounded-md p-3 text-sm transition
                    hover:bg-gray-100
                    ${active ? "bg-gray-100 text-gray-900" : "text-gray-700"}
                    ${isDesktop && collapsed ? "justify-center" : ""}`}
                  onClick={() => {
                    // มือถือ: กดเมนูแล้วปิด drawer
                    if (!isDesktop) setMobileOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5 shrink-0 text-gray-600" />

                  <span
                    className={`ml-3 whitespace-nowrap transition-all duration-200
                      ${isDesktop && collapsed ? "w-0 overflow-hidden opacity-0 ml-0" : "opacity-100"}
                    `}
                  >
                    {menu.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Top Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white border border-[#F3F4F6] rounded-full shadow-sm hover:bg-gray-50"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-gray-700" />
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}`}
      >
        <SidebarContent isDesktop />
      </aside>

      {/* Mobile Drawer + Overlay */}
      <div className={`lg:hidden fixed inset-0 z-50 ${mobileOpen ? "" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-200
            ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute top-0 left-0 h-full w-72 max-w-[85vw] transform bg-white transition-transform duration-200
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <SidebarContent isDesktop={false} />
        </aside>
      </div>

      <div className={`hidden lg:block ${collapsed ? "w-20" : "w-64"}`} />
    </>
  );
}
