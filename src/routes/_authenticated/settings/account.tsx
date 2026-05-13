import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/coming-soon'
import { RoleSwitch } from '@/components/shared/role-switch'
import { SettingsAccount } from '@/features/settings/account'

export const Route = createFileRoute('/_authenticated/settings/account')({
  component: AccountRoute,
})

function AccountRoute() {
  return <RoleSwitch admin={<SettingsAccount />} user={<ComingSoon />} />
}
