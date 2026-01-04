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
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const pathname = usePathname();

  // desktop collapse
  const [collapsed, setCollapsed] = useState(true);

  // mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  // mobile search input
  const mobileSearchRef = useRef(null);

  const menus = [
    { icon: Home, label: "หน้าแรก", href: "/" },
    { icon: Briefcase, label: "มองไกลกับผู้บริหาร", href: "/categories/executive-thoughts" },
    { icon: Users, label: "สนทนาบนเส้นทางงาน", href: "/categories/career-path-conversations" },
    { icon: BookOpen, label: "แนะนำงานวิจัย", href: "/categories/featured-research" },
    { icon: Clock, label: "สวนสุนันทาเมื่อวันวาน", href: "/categories/ssru-muea-wan" },
    { icon: Lightbulb, label: "มุมคิดวันนี้", href: "/categories/thoughts-today" },
    { icon: FileText, label: "สารคดีความรู้", href: "/categories/documentary-knowledge" },
    { icon: Star, label: "Hall of fame", href: "/categories/hall-of-fame" },
    { icon: Phone, label: "ติดต่อเรา", href: "/contact-us" },
    { icon: SquarePen, label: "เขียนบทความ", href: "/write" },
  ];

  const socials = [
    ["YouTube.webp", "https://www.youtube.com/@ssrutube/shorts"],
    ["facebook.png", "https://www.facebook.com/kaewchaochomonline"],
    ["Instagram.webp", "https://www.instagram.com/ssru_official"],
    ["x.png", "https://x.com/official_ssru"],
    ["line.png", "https://lin.ee/1WNbkCe"],
    ["tiktok.webp", "https://www.tiktok.com/@ssru_official"],
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // focus search input when drawer opens (mobile)
    setTimeout(() => mobileSearchRef.current?.focus(), 0);

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
        className="lg:hidden fixed top-4 left-4 z-90 p-2 bg-white border border-[#F3F4F6] rounded-full shadow-sm hover:bg-gray-50"
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
          className="lg:hidden fixed inset-0 z-80"
          onClick={() => setMobileOpen(false)}
        >
          {/* overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* drawer */}
          <aside
            className="absolute top-0 left-0 h-full w-72 max-w-[85vw] bg-white shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="h-20 px-4 flex items-center justify-between border-b border-[#F3F4F6]">
              <p className="text-sm font-semibold text-[#111827]">เมนู</p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            {/* Menu list (scrollable) */}
            <div className="flex-1 overflow-y-auto">
              <SidebarList isDesktop={false} />
            </div>

            {/* Bottom section : Search + Social + Language */}
            <div className="px-4 py-4 border-t border-[#F3F4F6] space-y-4">
              {/* Search */}
              <div className="w-full h-10 px-3 py-2 flex items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full focus-within:border-[#F06FAA]">
                <Search className="h-[1em] text-[#99A1AF]" />
                <input
                  ref={mobileSearchRef}
                  type="text"
                  placeholder="ค้นหา..."
                  className="w-full outline-none bg-transparent text-sm"
                />
              </div>

              {/* Social icons */}
              <ul className="flex flex-wrap items-center gap-2">
                {socials.map(([img, link], i) => (
                  <li key={i}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <img
                        src={`/assets/images/${img}`}
                        alt=""
                        className="
                          h-8 w-8 rounded-full
                          border border-[#E5E7EB]
                          bg-white p-1
                          transition
                          group-hover:scale-105
                          group-hover:shadow-sm
                          group-hover:opacity-90
                        "
                      />
                    </a>
                  </li>
                ))}
              </ul>

              {/* Language switch */}
              {/* <div className="inline-flex items-center gap-1 border border-[#E5E7EB] rounded-full p-0.5 bg-white">
                <button className="px-3 py-1 bg-[#F06FAA] text-white rounded-full text-sm">
                  TH
                </button>
                <button className="px-3 py-1 rounded-full text-sm text-[#111827] hover:bg-gray-50">
                  EN
                </button>
                <button className="px-3 py-1 rounded-full text-sm text-[#111827] hover:bg-gray-50">
                  CN
                </button>
              </div> */}
            </div>
          </aside>
        </div>
      )}


      {/* Spacer desktop */}
      <div className={`hidden lg:block ${collapsed ? "w-20" : "w-64"}`} />
    </>
  );
}
