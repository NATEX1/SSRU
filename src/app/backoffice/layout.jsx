import DashboardSidebar from '@/components/dashboard-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

export default function layout({children}) {
  return (
    <SidebarProvider>
        <DashboardSidebar />
        <main className='w-full'>
          <div className='px-8 py-4 border-b'>
            <SidebarTrigger />
          </div>
          {children}
        </main>
    </SidebarProvider>
  )
}
