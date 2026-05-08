import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    const token = useAuthStore.getState().auth.accessToken
    throw redirect({ to: token ? '/dashboard/overview' : '/' })
  },
})
