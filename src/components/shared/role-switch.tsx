import { type ReactNode } from 'react'
import { useAuthStore } from '@/stores/auth-store'

type Props = {
  admin: ReactNode
  user: ReactNode
}

export function RoleSwitch({ admin, user }: Props) {
  const role = useAuthStore((s) => s.auth.user?.role)
  return <>{role === 'admin' ? admin : user}</>
}
