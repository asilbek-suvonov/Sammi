import { useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useGithubAuth } from '@/api-hooks/auth/github/use-github-hooks'
import type { AuthResponse } from '@/service/auth/github/github.type'
import { useAuthStore, type AuthUser } from '@/stores/auth-store'

const GITHUB_STATE_KEY = 'sammi_github_oauth_state'
const GITHUB_CONSUMED_KEY = 'sammi_github_consumed_code'

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

const isConsumed = (code: string): boolean => {
  try {
    return sessionStorage.getItem(GITHUB_CONSUMED_KEY) === code
  } catch {
    return false
  }
}

const markConsumed = (code: string): void => {
  try {
    sessionStorage.setItem(GITHUB_CONSUMED_KEY, code)
  } catch {
    /* sessionStorage unavailable — guard degrades, ref + URL strip still cover */
  }
}

export function GithubCallbackPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.auth.login)
  const handledRef = useRef(false)

  const { mutate: exchange } = useGithubAuth({
    onSuccess: (data) => {
      const user = responseToUser(data)
      login({
        accessToken: data.access ?? '',
        refreshToken: data.refresh ?? '',
        user,
      })
      toast.success(`Xush kelibsiz, ${user.fullName || user.email}!`)
      navigate({ to: '/dashboard/overview' })
    },
    onError: () => {
      // Backend 400 / network / 5xx toasts are emitted by the global axios
      // interceptor (`src/api/index.ts`) — just route the user back home.
      navigate({ to: '/' })
    },
  })

  useEffect(() => {
    // 1) StrictMode guard: at most one body execution per mount.
    if (handledRef.current) return
    handledRef.current = true

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    const oauthError = params.get('error_description') || params.get('error')

    // 2) Strip OAuth params synchronously, BEFORE the mutation fires.
    //    A refresh / remount after this point no longer sees the code.
    window.history.replaceState({}, '', window.location.pathname)

    if (oauthError) {
      toast.error(`GitHub: ${oauthError}`)
      navigate({ to: '/' })
      return
    }

    if (!code) {
      navigate({ to: '/' })
      return
    }

    const expected = sessionStorage.getItem(GITHUB_STATE_KEY)
    sessionStorage.removeItem(GITHUB_STATE_KEY)
    if (expected && state && expected !== state) {
      toast.error('GitHub kirish: state mos kelmadi')
      navigate({ to: '/' })
      return
    }

    // 3) Consumed-code guard: even across tab refreshes / back-forward cache,
    //    the same code is never sent to the backend more than once.
    if (isConsumed(code)) {
      navigate({ to: '/' })
      return
    }
    markConsumed(code)

    // 4) Mutation-based exchange (TanStack Query — no retry by default).
    exchange({ code })
  }, [exchange, navigate])

  return (
    <div className='flex min-h-svh items-center justify-center bg-background'>
      <div className='flex flex-col items-center gap-3 text-muted-foreground'>
        <Loader2 className='size-6 animate-spin' />
        <p className='text-sm'>GitHub orqali kirish…</p>
      </div>
    </div>
  )
}
