/* eslint-disable react-refresh/only-export-components */
import AdminOverview from '@/features/dashboard/admin/AdminOverview'
import UserOverview from '@/features/dashboard/user/UserOverview'
import { useAuthStore } from '@/stores/auth-store'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/overview')({
  component: Overview,
})


function Overview() {
  const { auth } = useAuthStore()
  const isAdmin = auth.user?.role === 'admin'

  return isAdmin ? <AdminOverview /> : <UserOverview />
}

