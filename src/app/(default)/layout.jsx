import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function layout({ children }) {
  return (
    <div className="bg-white">
      <AppHeader />
      <main>
        <AppSidebar />
        <div className="container mx-auto mt-20">{children}</div>
      </main>

      <AppFooter />
    </div>
  );
}
