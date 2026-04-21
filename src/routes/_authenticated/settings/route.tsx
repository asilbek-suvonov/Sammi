import { createFileRoute, redirect } from '@tanstack/react-router'
import { Settings } from '@/features/settings'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/settings')({
  beforeLoad: () => {
    const role = useAuthStore.getState().auth.user?.role
    if (role !== 'admin') {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: Settings,
})
