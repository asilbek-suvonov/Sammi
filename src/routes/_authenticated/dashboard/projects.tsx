/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { AdminProjects } from '@/features/dashboard/admin/projects'
import { UserProjects } from '@/features/dashboard/user/projects'

export const Route = createFileRoute('/_authenticated/dashboard/projects')({
  component: ProjectsPage,
})

function ProjectsPage() {
  const { auth } = useAuthStore()
  return auth.user?.role === 'admin' ? <AdminProjects /> : <UserProjects />
}
