/* eslint-disable react-refresh/only-export-components */
import AdminSources from '@/features/dashboard/admin/AdminSources'
import UserSources from '@/features/dashboard/user/UserSources'
import { useAuthStore } from '@/stores/auth-store'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/sources')({
  component: SourcesPage,
})

function SourcesPage() {
  const { auth } = useAuthStore()
  const isAdmin = auth.user?.role === 'admin'

  return isAdmin ? <AdminSources /> : <UserSources />
}
















