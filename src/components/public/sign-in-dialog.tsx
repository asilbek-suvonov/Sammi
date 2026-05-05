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
import { useGithubSignIn } from '@/hooks/auth/use-github-signin'
import { useGoogleSignIn } from '@/hooks/auth/use-google-signin'
import { useNavigate } from '@tanstack/react-router'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'

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

const mergeBackendUser = (
  base: AuthUser,
  data: GoogleAuthResponse
): AuthUser => ({
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
  const [internalOpen, setInternalOpen] = useState(false)
  const [emailStep, setEmailStep] = useState(false)
  const [email, setEmail] = useState('')

  const isOpen = controlledOpen ?? internalOpen
  const setIsOpen = (value: boolean) => {
    if (onOpenChange) onOpenChange(value)
    else setInternalOpen(value)
    if (!value) {
      setTimeout(() => { setEmailStep(false); setEmail('') }, 200)
    }
  }

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
        } catch {
          // Backend not reachable — fall back to Google profile + access_token.
        }

        login({ accessToken, refreshToken, user })
        toast.success(`Welcome, ${user.firstName || user.email}!`)
        setIsOpen(false)
        onSuccess?.()
        navigate({ to: '/dashboard' })
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Sign-in failed')
      } finally {
        setSigningIn(false)
      }
    },
    onError: () => {
      toast.error('Google sign-in canceled')
    },
    onNonOAuthError: () => {
      toast.error(
        'Google sign-in could not start. Add http://localhost:5173 to your OAuth client’s Authorized JavaScript origins.'
      )
    },
  })

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
              variant='outline'
              className='w-full gap-2'
              onClick={() => loginWithGoogle()}
              disabled={signingIn}
            >
              <IconGoogle className='size-4' />
              {signingIn ? 'Signing in…' : 'Continue with Google'}
            </Button>

            <Button
              variant='outline'
              className='w-full gap-2'
              onClick={() => toast.info('GitHub auth coming soon!')}
              disabled={signingIn}
            >
              <IconGithub className='size-4' />
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