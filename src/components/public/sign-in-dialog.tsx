import { type ReactNode, useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { useGoogleAuth } from '@/api-hooks'
import type { GoogleAuthResponse } from '@/service/auth'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { IconGithub } from '@/assets/brand-icons'

const USER_KEY = 'sammi_user'
const ACCESS_TOKEN_KEY = 'sammi_access_token'
const REFRESH_TOKEN_KEY = 'sammi_refresh_token'

interface SignInDialogProps {
  trigger?: ReactNode
  onSuccess?: () => void
  title?: string
  description?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

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

  const open = controlledOpen ?? internalOpen

  const setOpen = (value: boolean) => {
    ;(onOpenChange ?? setInternalOpen)(value)
    if (!value) {
      setEmailStep(false)
      setEmail('')
    }
  }

  const { mutate: authenticateWithGoogle, isPending } = useGoogleAuth({
    onSuccess: (data: GoogleAuthResponse) => {
      // User ma'lumotlarini saqlash
      localStorage.setItem(USER_KEY, JSON.stringify(data))

      // Agar backend token qaytarsa saqlash
      if (data.access) localStorage.setItem(ACCESS_TOKEN_KEY, data.access)
      if (data.refresh) localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh)

      setOpen(false)
      toast.success(
        data.is_new_user
          ? 'Xush kelibsiz! Akkaunt muvaffaqiyatli yaratildi.'
          : 'Muvaffaqiyatli kirdingiz!'
      )
      onSuccess?.()
      navigate({ to: '/dashboard' })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Kirish amalga oshmadi — qayta urinib ko\'ring.')
    },
  })

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Iltimos, to\'g\'ri elektron pochta kiriting.')
      return
    }
    sessionStorage.setItem('sammi_pending_email', email)
    setOpen(false)
    navigate({ to: '/otp' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {emailStep
              ? 'Enter your email to receive a verification code.'
              : description}
          </DialogDescription>
        </DialogHeader>

        {!emailStep ? (
          <div className='flex flex-col items-center gap-3 pt-2'>
            {isPending ? (
              <div className='flex items-center gap-2 py-3 text-muted-foreground'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <span>Yuklanmoqda...</span>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    authenticateWithGoogle({
                      token: credentialResponse.credential,
                    })
                  }
                }}
                onError={() => {
                  toast.error('Google orqali kirish bekor qilindi.')
                }}
                size='large'
                width='350'
                text='continue_with'
                shape='rectangular'
                theme='outline'
              />
            )}

            <Button
              variant='outline'
              className='w-full gap-2'
              disabled={isPending}
              onClick={() => toast.info('GitHub auth coming soon!')}
            >
              <IconGithub className='size-4' />
              Continue with GitHub
            </Button>

            <div className='relative w-full py-1'>
              <Separator />
              <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground'>
                or
              </span>
            </div>

            <Button
              variant='secondary'
              className='w-full'
              disabled={isPending}
              onClick={() => setEmailStep(true)}
            >
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
              We'll send a verification code to this email.
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