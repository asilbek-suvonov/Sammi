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
        } catch {
          // Backend exchange failed — fall back to client-side identity.
        }

        login({ accessToken, refreshToken, user })
        toast.success(`Welcome, ${user.firstName || user.email}!`)
        onDone?.()
        navigate({ to: '/dashboard' })
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Sign-in failed')
      } finally {
        setSigningIn(false)
      }
    },
    onError: () => toast.error('Google sign-in canceled'),
    onNonOAuthError: () =>
      toast.error(
        'Google sign-in could not start. Add http://localhost:5173 to your OAuth client’s Authorized JavaScript origins.'
      ),
  })

  return { start, signingIn }
}
