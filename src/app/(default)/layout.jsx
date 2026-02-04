import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import AppSidebar from "@/components/app-sidebar";
import prisma from "@/lib/prisma";

export default async function layout({ children }) {
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div className="bg-white flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <AppSidebar categories={categories} />
        <div className="container mx-auto mt-20">{children}</div>
      </main>

      <AppFooter />
    </div>
  );
}
