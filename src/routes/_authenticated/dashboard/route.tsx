import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { requireAuth } from '@/lib/route-guards'

export const Route = createFileRoute('/_authenticated/dashboard')({
  beforeLoad: ({ location }) => {
    requireAuth(location.href)
  },
  component: DashboardLayout,
})
