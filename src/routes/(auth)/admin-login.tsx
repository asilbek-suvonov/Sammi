import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignIn2 } from '@/features/auth/sign-in/sign-in-2'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/(auth)/admin-login')({
  beforeLoad: () => {
    const { accessToken, user } = useAuthStore.getState().auth
    if (accessToken || user) {
      throw redirect({ to: '/dashboard/overview' })
    }
  },
  component: SignIn2,
})
