import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { googleAuth } from '@/service/auth'
import { useAuthStore, type AuthUser } from '@/stores/auth-store'

function decodeJwtPayload(token: string): Record<string, string> {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    return JSON.parse(atob(padded)) as Record<string, string>
  } catch {
    return {}
  }
}

export function useGoogleSignIn(onDone?: () => void) {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.auth.login)
  const [signingIn, setSigningIn] = useState(false)

  const handleSuccess = async (idToken: string) => {
    if (!idToken) return

    setSigningIn(true)
    try {
      const payload = decodeJwtPayload(idToken)
      const data = await googleAuth({ token: idToken })

      const user: AuthUser = {
        id: data.id,
        email: data.email || payload.email,
        fullName: data.full_name || payload.name,
        firstName: payload.given_name,
        lastName: payload.family_name,
        avatarUrl: data.avatar_url || payload.picture,
        country: data.country,
        languageCode: data.language_code || payload.locale,
        isNewUser: data.is_new_user,
        role: 'user',
      }

      login({
        accessToken: data.access ?? '',
        refreshToken: data.refresh ?? '',
        user,
      })

      toast.success(`Xush kelibsiz, ${user.firstName || user.fullName || 'Sammi'}!`)
      onDone?.()
      navigate({ to: '/dashboard' })
    } catch {
      // Backend error toast is already shown by the global axios interceptor
      // (DRF-shaped `{ token: [message] }` is unwrapped in `src/api/index.ts`).
    } finally {
      setSigningIn(false)
    }
  }

  return { handleSuccess, signingIn }
}
