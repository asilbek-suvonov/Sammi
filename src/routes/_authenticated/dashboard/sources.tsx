import AdminSources from '@/features/dashboard/sources/admin-sources'
import UserSources from '@/features/dashboard/sources/user-sources'
import { RoleSwitch } from '@/components/shared/role-switch'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/sources')({
  component: SourcesPage,
})

function SourcesPage() {
  return <RoleSwitch admin={<AdminSources />} user={<UserSources />} />
}
