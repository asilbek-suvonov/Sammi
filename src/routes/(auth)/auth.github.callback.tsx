import { createFileRoute } from '@tanstack/react-router'
import { GithubCallbackPage } from '@/features/auth/github-callback'

export const Route = createFileRoute('/(auth)/auth/github/callback')({
  component: GithubCallbackPage,
})
