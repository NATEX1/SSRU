import DashboardSidebar from "@/components/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

export default function layout({ children }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full bg-muted">
        <div className="p-4 border-b bg-white shadow">
          <SidebarTrigger />
        </div>
        <div className="p-8">{children}</div>
      </main>
    </SidebarProvider>
  );
}
