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
import { useSendOtp } from '@/api-hooks/auth/userOTP/use-OTP'
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
      setTimeout(() => {
        setEmailStep(false)
        setEmail('')
      }, 200)
    }
  }

  const closeAndForward = () => {
    setIsOpen(false)
    onSuccess?.()
  }

  const google = useGoogleSignIn(closeAndForward)
  const github = useGithubSignIn(closeAndForward)
  const signingIn = google.signingIn || github.signingIn

  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp({
    onSuccess: () => {
      sessionStorage.setItem('sammi_pending_email', email)
      setIsOpen(false)
      navigate({ to: '/otp' })
    },
    // Error handling done in hook with getErrorMessage
  })

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // Event bubbling ni to'xtatish
    
    if (isSendingOtp) return // Agar jo'natilayotgan bo'lsa, qayta jo'natmaslik
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email')
      return
    }
    
    sendOtp({ email })
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
              onClick={() => google.start()}
              disabled={signingIn}
            >
              <IconGoogle className="size-4" />
              {google.signingIn ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => github.start()}
              disabled={signingIn}
            >
              <IconGithub className="size-4" />
              {github.signingIn ? 'Signing in...' : 'Continue with GitHub'}
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
              disabled={signingIn || isSendingOtp}
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
              <Button type="submit" className="flex-1" disabled={isSendingOtp}>
                {isSendingOtp ? 'Sending...' : 'Continue'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}