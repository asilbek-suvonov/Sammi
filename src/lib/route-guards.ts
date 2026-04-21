import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'

export const requireAuth = (redirectTo?: string) => {
  const { accessToken } = useAuthStore.getState().auth

  if (!accessToken) {
    throw redirect({
      to: '/login',
      search: redirectTo ? { redirect: redirectTo } : undefined,
    })
  }
}

export const requireAdmin = () => {
  const { user } = useAuthStore.getState().auth

  if (user?.role !== 'admin') {
    throw redirect({ to: '/dashboard/overview' })
  }
}
