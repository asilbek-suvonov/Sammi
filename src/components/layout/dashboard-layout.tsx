import { AppSidebar } from '@/components/layout/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { getCookie } from '@/lib/cookies'
import { Outlet } from '@tanstack/react-router'

export function DashboardLayout() {
  const defaultOpen = getCookie('sidebar_state') !== 'false'

  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <Outlet />
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}
