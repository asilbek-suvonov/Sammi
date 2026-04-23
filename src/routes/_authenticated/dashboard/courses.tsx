/* eslint-disable react-refresh/only-export-components */
import AdminCoursesView from '@/features/dashboard/admin/AdminCoursesView'
import UserCoursesView from '@/features/dashboard/user/UserCoursesView'
import { useAuthStore } from '@/stores/auth-store'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/courses')({
  component: CoursesPage,
})


function CoursesPage() {
  const { auth } = useAuthStore()
  const isAdmin = auth.user?.role === 'admin'

  return isAdmin ? <AdminCoursesView /> : <UserCoursesView />
}

