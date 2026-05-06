import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/auth/callback/github')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/api/auth/callback/github"!</div>
}
