import axios from 'axios'
import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { googleAuth, type GoogleAuthResponse } from '@/service/auth'
import { useAuthStore, type AuthUser } from '@/stores/auth-store'

interface GoogleProfile {
  sub: string
  email: string
  email_verified: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale?: string
}

const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

const fetchGoogleProfile = async (accessToken: string): Promise<GoogleProfile> => {
  const { data } = await axios.get<GoogleProfile>(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return data
}

const profileToAuthUser = (p: GoogleProfile): AuthUser => ({
  email: p.email,
  fullName: p.name,
  firstName: p.given_name,
  lastName: p.family_name,
  avatarUrl: p.picture,
  languageCode: p.locale,
  role: 'user',
})

const mergeBackendUser = (base: AuthUser, data: GoogleAuthResponse): AuthUser => ({
  ...base,
  id: data.id,
  email: data.email || base.email,
  fullName: data.full_name || base.fullName,
  avatarUrl: data.avatar_url || base.avatarUrl,
  country: data.country,
  languageCode: data.language_code || base.languageCode,
  isNewUser: data.is_new_user,
})

export function useGoogleSignIn(onDone?: () => void) {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.auth.login)
  const [signingIn, setSigningIn] = useState(false)

  const start = useGoogleLogin({
    flow: 'implicit',
    scope: 'openid email profile',
    onSuccess: async (tokenResponse) => {
      setSigningIn(true)
      try {
        const profile = await fetchGoogleProfile(tokenResponse.access_token)
        let user = profileToAuthUser(profile)
        let accessToken = tokenResponse.access_token
        let refreshToken = ''

        try {
          const data = await googleAuth({ access_token: tokenResponse.access_token })
          if (data?.access) {
            accessToken = data.access
            refreshToken = data.refresh ?? ''
            user = mergeBackendUser(user, data)
          }
        } catch (backendErr) {
          const errStatus = (backendErr as { status?: number }).status
          // 4xx: backend explicitly rejected the token — abort login
          // (interceptor already showed the error toast)
          if (errStatus && errStatus >= 400 && errStatus < 500) {
            return
          }
          // Network error or 5xx: fall back to client-side identity
        }

        login({ accessToken, refreshToken, user })
        toast.success(`Xush kelibsiz, ${user.firstName || user.email}!`)
        onDone?.()
        navigate({ to: '/dashboard' })
      } catch (err) {
        const errStatus = (err as { status?: number }).status
        // Don't double-toast if interceptor already handled it
        if (!errStatus || errStatus === 0) {
          toast.error(err instanceof Error ? err.message : 'Kirish muvaffaqiyatsiz')
        }
      } finally {
        setSigningIn(false)
      }
    },
    onError: () => toast.error('Google orqali kirish bekor qilindi'),
    onNonOAuthError: () =>
      toast.error(
        'Google kirish boshlanmadi. http://localhost:5173 ni OAuth client Authorized JavaScript origins ga qo\'shing.'
      ),
  })

  return { start, signingIn }
}
