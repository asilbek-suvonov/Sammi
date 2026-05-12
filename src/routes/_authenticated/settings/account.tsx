import { createFileRoute } from '@tanstack/react-router'
import { SettingsAccount } from '@/features/settings/account'
import { useAuthRole } from '@/stores/selectors'
import { ComingSoon } from '@/components/coming-soon';

export const Route = createFileRoute('/_authenticated/settings/account')({
  component: AccountRoute,
})

function AccountRoute() {
  const role = useAuthRole()

  if (role !== 'admin') {
    return (
      <ComingSoon/>
    )
  }

  return <SettingsAccount />
}
