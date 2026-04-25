import { createFileRoute } from '@tanstack/react-router'
import { Settings } from '@/features/settings'
import { requireAuth } from '@/lib/route-guards'

export const Route = createFileRoute('/_authenticated/settings')({
  beforeLoad: ({ location }) => requireAuth(location.href),
  component: Settings,
})
