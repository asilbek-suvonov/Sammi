import { createFileRoute } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Settings } from '@/features/settings'
import { requireAuth } from '@/lib/route-guards'

export const Route = createFileRoute('/_authenticated/settings')({
  beforeLoad: ({ location }) => requireAuth(location.href),
  component: SettingsRoute,
})

function SettingsRoute() {
  return (
    <AuthenticatedLayout>
      <Settings />
    </AuthenticatedLayout>
  )
}
