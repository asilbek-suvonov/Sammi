import AdminOverview from '@/features/dashboard/overview/admin-overview'
import UserOverview from '@/features/dashboard/overview/user-overview'
import { RoleSwitch } from '@/components/shared/role-switch'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/overview')({
  component: Overview,
})

function Overview() {
  return <RoleSwitch admin={<AdminOverview />} user={<UserOverview />} />
}
