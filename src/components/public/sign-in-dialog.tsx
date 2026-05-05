import { IconGithub } from '@/assets/brand-icons'
import { IconGoogle } from '@/assets/brand-icons/icon-google'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from '@tanstack/react-router'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { googleAuth, type GoogleAuthResponse } from '@/service/auth'
import { useAuthStore, type AuthUser } from '@/stores/auth-store'

// --- Interfaces ---
interface SignInDialogProps {
  trigger?: ReactNode
  onSuccess?: () => void
  title?: string
  description?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

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

// --- Constants & Helpers ---
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

const fetchGoogleProfile = async (accessToken: string): Promise<GoogleProfile> => {
  const res = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`Google userinfo failed (${res.status})`)
  return res.json()
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

export function SignInDialog({
  trigger,
  onSuccess,
  title = 'Welcome to Sammi',
  description = 'Sign in to access courses and track progress.',
  open: controlledOpen,
  onOpenChange,
}: SignInDialogProps) {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.auth.login)

  const [internalOpen, setInternalOpen] = useState(false)
  const [emailStep, setEmailStep] = useState(false)
  const [email, setEmail] = useState('')
  const [signingIn, setSigningIn] = useState(false)

  const isOpen = controlledOpen ?? internalOpen
  const setIsOpen = (value: boolean) => {
    if (onOpenChange) onOpenChange(value)
    else setInternalOpen(value)
    if (!value) {
      setTimeout(() => { setEmailStep(false); setEmail('') }, 200)
    }
  }

  // --- Google Login ---
  const loginWithGoogle = useGoogleLogin({
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
        } catch (e) {
          console.error("Backend auth failed, using Google profile only", e)
        }

        login({ accessToken, refreshToken, user })
        toast.success(`Welcome back, ${user.firstName || user.fullName}!`)
        setIsOpen(false)
        onSuccess?.()
        navigate({ to: '/dashboard' })
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Sign-in failed')
      } finally {
        setSigningIn(false)
      }
    },
    onError: () => toast.error('Google sign-in canceled'),
  })

  // --- GitHub Login ---
  const loginWithGithub = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID

    if (!clientId) {
      toast.error('GitHub Client ID is not configured')
      return
    }

    // State for CSRF protection
    const state = Math.random().toString(36).substring(7)
    try {
      localStorage.setItem('github_oauth_state', state)
    } catch {
      // ignore storage errors
    }

    const params = new URLSearchParams({ client_id: clientId, scope: 'user:email', state })

    // Only include redirect_uri if developer explicitly set it in env.
    // If omitted, GitHub will redirect to the Authorization callback URL
    // registered for the OAuth App (recommended when possible).
    const explicitCallback = import.meta.env.VITE_GITHUB_CALLBACK_URL
    if (explicitCallback) params.set('redirect_uri', explicitCallback)

    const githubUrl = `https://github.com/login/oauth/authorize?${params.toString()}`
    window.location.assign(githubUrl)
  }

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email')
      return
    }
    sessionStorage.setItem('sammi_pending_email', email)
    setIsOpen(false)
    navigate({ to: '/otp' })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {emailStep ? 'Enter your email for verification.' : description}
          </DialogDescription>
        </DialogHeader>

        {!emailStep ? (
          <div className="space-y-3 pt-2">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => loginWithGoogle()}
              disabled={signingIn}
            >
              <IconGoogle className="size-4" />
              {signingIn ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={loginWithGithub}
              disabled={signingIn}
            >
              <IconGithub className="size-4" />
              Continue with GitHub
            </Button>

            <div className="relative w-full py-1">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                or
              </span>
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setEmailStep(true)}
              disabled={signingIn}
            >
              Continue with Email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleEmailContinue} className="space-y-3 pt-2">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => setEmailStep(false)}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Continue
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}