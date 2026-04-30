import AdminProjectsView from '@/features/dashboard/projects/admin-projects-view'
import UserProjectsView from '@/features/dashboard/projects/user-projects-view'
import { RoleSwitch } from '@/components/shared/role-switch'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/projects/')({
  component: ProjectsPage,
})

function ProjectsPage() {
  return (
    <RoleSwitch admin={<AdminProjectsView />} user={<UserProjectsView />} />
  )
}
