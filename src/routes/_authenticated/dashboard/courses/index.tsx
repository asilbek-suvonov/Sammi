import AdminCoursesView from '@/features/dashboard/courses/admin-courses-view'
import UserCoursesView from '@/features/dashboard/courses/user-courses-view'
import { RoleSwitch } from '@/components/shared/role-switch'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/courses/')({
  component: CoursesPage,
})

function CoursesPage() {
  return (
    <RoleSwitch admin={<AdminCoursesView />} user={<UserCoursesView />} />
  )
}
