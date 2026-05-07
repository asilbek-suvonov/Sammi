import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useGithubAuth } from '@/api-hooks/auth/github/use-github-hooks'
import type { AuthResponse } from '@/service/auth/github/github.type'
import { useAuthStore, type AuthUser } from '@/stores/auth-store'

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'
const GITHUB_PROCESSING_KEY = 'sammi_github_processing'

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

  const { mutate: githubMutate, isPending } = useGithubAuth({
    onSuccess: (data) => {
      sessionStorage.removeItem(GITHUB_PROCESSING_KEY)
      const user = responseToUser(data)
      const accessToken = data.access ?? ''
      const refreshToken = data.refresh ?? ''
      login({ accessToken, refreshToken, user })
      toast.success(`Xush kelibsiz, ${user.fullName || user.email}!`)
      onDone?.()
      navigate({ to: '/dashboard' })
      setSigningIn(false)
    },
    onError: (err) => {
      sessionStorage.removeItem(GITHUB_PROCESSING_KEY)
      const errStatus = (err as { status?: number }).status
      if (!errStatus || errStatus === 0) {
        toast.error('GitHub orqali kirish muvaffaqiyatsiz')
      }
      setSigningIn(false)
    },
  })

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      const payload = event.data as { source?: string; code?: string; state?: string }
      if (payload?.source !== 'sammi-github-oauth' || !payload.code) return

      // Bir vaqtda mount bo'lgan bir nechta SignInDialog dan faqat bittasi ishlatilsin
      if (sessionStorage.getItem(GITHUB_PROCESSING_KEY)) return
      sessionStorage.setItem(GITHUB_PROCESSING_KEY, '1')

      const expected = sessionStorage.getItem('sammi_github_oauth_state')
      if (expected && payload.state && payload.state !== expected) {
        toast.error('GitHub kirish: state mos kelmadi')
        sessionStorage.removeItem(GITHUB_PROCESSING_KEY)
        return
      }
      sessionStorage.removeItem('sammi_github_oauth_state')
      popupRef.current?.close()
      githubMutate({ code: payload.code })
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [githubMutate])

  const start = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID as string | undefined
    if (!clientId) {
      toast.error('GitHub kirish sozlanmagan (VITE_GITHUB_CLIENT_ID yo\'q).')
      return
    }
    setSigningIn(true)
    const redirectUri = `${window.location.origin}/auth/github/callback`
    const url = buildAuthorizeUrl(clientId, redirectUri)
    popupRef.current = window.open(url, 'github-oauth', 'width=600,height=720')
    if (!popupRef.current) {
      toast.error('Popup bloklandi. Iltimos, popupga ruxsat bering.')
      setSigningIn(false)
    }
  }

  return { start, signingIn: signingIn || isPending }
}
