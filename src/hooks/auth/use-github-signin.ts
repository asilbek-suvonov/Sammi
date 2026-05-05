import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useGithubAuth } from '@/api-hooks/auth/github/use-github-hooks'
import type { AuthResponse } from '@/service/auth/github/github.type'
import { useAuthStore, type AuthUser } from '@/stores/auth-store'

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'

const responseToUser = (data: AuthResponse): AuthUser => ({
  id: data.id,
  email: data.email,
  fullName: data.full_name,
  avatarUrl: data.avatar_url,
  country: data.country,
  languageCode: data.language_code,
  isNewUser: data.is_new_user,
  role: 'user',
})

const buildAuthorizeUrl = (clientId: string, redirectUri: string): string => {
  const state = Math.random().toString(36).slice(2)
  sessionStorage.setItem('sammi_github_oauth_state', state)
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'read:user user:email',
    state,
  })
  return `${GITHUB_AUTHORIZE_URL}?${params.toString()}`
}

export function useGithubSignIn(onDone?: () => void) {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.auth.login)
  const popupRef = useRef<Window | null>(null)
  const [signingIn, setSigningIn] = useState(false)

  const mutation = useGithubAuth({
    onSuccess: (data) => {
      const user = responseToUser(data)
      const accessToken = data.access ?? ''
      const refreshToken = data.refresh ?? ''
      login({ accessToken, refreshToken, user })
      toast.success(`Welcome, ${user.fullName || user.email}!`)
      onDone?.()
      navigate({ to: '/dashboard' })
      setSigningIn(false)
    },
    onError: (err) => {
      toast.error(err.message || 'GitHub sign-in failed')
      setSigningIn(false)
    },
  })

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      const payload = event.data as { source?: string; code?: string; state?: string }
      if (payload?.source !== 'sammi-github-oauth' || !payload.code) return
      const expected = sessionStorage.getItem('sammi_github_oauth_state')
      if (expected && payload.state && payload.state !== expected) {
        toast.error('GitHub sign-in: state mismatch')
        return
      }
      sessionStorage.removeItem('sammi_github_oauth_state')
      popupRef.current?.close()
      mutation.mutate({ code: payload.code })
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [mutation])

  const start = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID as string | undefined
    if (!clientId) {
      toast.error('GitHub sign-in is not configured (VITE_GITHUB_CLIENT_ID missing).')
      return
    }
    setSigningIn(true)
    const redirectUri = `${window.location.origin}/auth/github/callback`
    const url = buildAuthorizeUrl(clientId, redirectUri)
    popupRef.current = window.open(url, 'github-oauth', 'width=600,height=720')
    if (!popupRef.current) {
      toast.error('Popup blocked. Please allow popups and try again.')
      setSigningIn(false)
    }
  }

  return { start, signingIn: signingIn || mutation.isPending }
}
