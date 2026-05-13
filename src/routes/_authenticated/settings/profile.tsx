import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/coming-soon'
import { RoleSwitch } from '@/components/shared/role-switch'
import { SettingsProfile } from '@/features/settings/profile'

export const Route = createFileRoute('/_authenticated/settings/profile')({
  component: ProfileRoute,
})

function ProfileRoute() {
  return <RoleSwitch admin={<SettingsProfile />} user={<ComingSoon />} />
}
