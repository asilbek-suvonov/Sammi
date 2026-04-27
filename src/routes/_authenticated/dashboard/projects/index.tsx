/* eslint-disable react-refresh/only-export-components */
import AdminProjectsView from '@/features/dashboard/admin/AdminProjectsView'
import UserProjectsView from '@/features/dashboard/user/UserProjectsView'
import { useAuthStore } from '@/stores/auth-store'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/projects/')({
  component: ProjectsPage,
})

function ProjectsPage() {
  const { auth } = useAuthStore()
  const isAdmin = auth.user?.role === 'admin'

  return isAdmin ? <AdminProjectsView /> : <UserProjectsView />
}
