import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '@/lib/route-guards'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    requireAuth(location.href)
  },
  component: Outlet,
})
