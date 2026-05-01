import { IconGithub } from '@/assets/brand-icons'
import { IconGoogle } from '@/assets/brand-icons/icon-google'
import { useGoogleAuth } from '@/api-hooks'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useAuthActions } from '@/stores/selectors'
import { msFromNow, nowMs } from '@/lib/time'
import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

interface SignInDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const REFRESH_TOKEN_KEY = 'sammi_refresh_token'

export function SignInDialog({ open, onOpenChange }: SignInDialogProps) {
  const navigate = useNavigate()
  const { setUser, setAccessToken } = useAuthActions()
  const [emailStep, setEmailStep] = useState(false)
  const [email, setEmail] = useState('')

  const handleClose = (value: boolean) => {
    onOpenChange(value)
    if (!value) {
      setEmailStep(false)
      setEmail('')
    }
  }

  const { mutate: authenticateWithGoogle, isPending: isGoogleLoading } = useGoogleAuth({
    onSuccess: (data) => {
      const { access, refresh } = data

      localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
      setAccessToken(access)
      setUser({
        accountNo: `USR-${nowMs()}`,
        firstName: 'User',
        lastName: '',
        email: '',
        role: 'user',
        exp: msFromNow(24 * 60 * 60 * 1000),
      })

      toast.success('Muvaffaqiyatli kirdingiz!')
      handleClose(false)
      navigate({ to: '/dashboard' })
    },
    onError: (error) => {
      toast.error(error.message || "Server bilan bog'lanishda xatolik")
    },
  })

  const startGoogleLogin = useGoogleLogin({
    scope: 'openid email profile',
    onSuccess: (tokenResponse) => {
      authenticateWithGoogle({ token: tokenResponse.access_token })
    },
    onError: () => toast.error('Google orqali kirish bekor qilindi'),
  })

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error("Iltimos, to'g'ri elektron pochta kiriting.")
      return
    }
    sessionStorage.setItem('sammi_pending_email', email)
    handleClose(false)
    navigate({ to: '/otp' })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>Welcome to Sammi</DialogTitle>
          <DialogDescription>
            {emailStep
              ? 'Enter your email to receive a verification code.'
              : 'Sign in to access courses and track progress.'}
          </DialogDescription>
        </DialogHeader>

        {!emailStep ? (
          <div className='space-y-3 pt-2'>
            <Button
              variant='outline'
              className='w-full gap-2'
              onClick={() => startGoogleLogin()}
              disabled={isGoogleLoading}
            >
              <IconGoogle className='size-4' />
              {isGoogleLoading ? 'Yuklanmoqda...' : 'Continue with Google'}
            </Button>

            <Button
              variant='outline'
              className='w-full gap-2'
              onClick={() => toast.info('GitHub auth coming soon!')}
            >
              <IconGithub className='size-4' /> Continue with GitHub
            </Button>

            <div className='relative py-1'>
              <Separator />
              <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground'>
                or
              </span>
            </div>

            <Button variant='secondary' className='w-full' onClick={() => setEmailStep(true)}>
              Continue with Email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleEmailContinue} className='space-y-3 pt-2'>
            <Input
              type='email'
              placeholder='you@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <p className='text-xs text-muted-foreground'>
              We&apos;ll send a verification code to this email.
            </p>
            <div className='flex gap-2'>
              <Button
                type='button'
                variant='ghost'
                className='flex-1'
                onClick={() => setEmailStep(false)}
              >
                Back
              </Button>
              <Button type='submit' className='flex-1'>
                Continue
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
