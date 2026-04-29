import { createFileRoute } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { requireAuth } from '@/lib/route-guards'

export const Route = createFileRoute('/_authenticated/dashboard')({
  beforeLoad: ({ location }) => {
    requireAuth(location.href)
  },
  component: AuthenticatedLayout,
})
