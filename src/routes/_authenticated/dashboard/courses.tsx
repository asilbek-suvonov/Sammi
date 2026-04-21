/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { AdminCourses } from '@/features/dashboard/admin/courses'
import { UserCourses } from '@/features/dashboard/user/courses'

export const Route = createFileRoute('/_authenticated/dashboard/courses')({
  component: CoursesPage,
})

function CoursesPage() {
  const { auth } = useAuthStore()
  return auth.user?.role === 'admin' ? <AdminCourses /> : <UserCourses />
}
