import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'

export const requireAuth = () => {
  const { accessToken } = useAuthStore.getState().auth

  if (!accessToken) {
    throw redirect({ to: '/' })
  }
}

export const requireAdmin = () => {
  const { user } = useAuthStore.getState().auth

  if (user?.role !== 'admin') {
    throw redirect({ to: '/dashboard/overview' })
  }
}
