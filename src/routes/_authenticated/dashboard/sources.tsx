/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '@/lib/route-guards'
import { AdminSources } from '@/features/dashboard/admin/sources'

export const Route = createFileRoute('/_authenticated/dashboard/sources')({
  beforeLoad: () => {
    requireAdmin()
  },
  component: AdminSources,
})
