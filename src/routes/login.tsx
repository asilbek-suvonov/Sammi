import { z } from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    const token = useAuthStore.getState().auth.accessToken
    if (token) {
      throw redirect({ to: '/dashboard/overview' })
    }
  },
  validateSearch: searchSchema,
})
