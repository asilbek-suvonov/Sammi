import { IconGithub } from '@/assets/brand-icons'
import { IconGoogle } from '@/assets/brand-icons/icon-google'
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
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

interface SignInDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignInDialog({ open, onOpenChange }: SignInDialogProps) {
  const navigate = useNavigate()
  const [emailStep, setEmailStep] = useState(false)
  const [email, setEmail] = useState('')

  const handleClose = (value: boolean) => {
    onOpenChange(value)
    if (!value) { setEmailStep(false); setEmail('') }
  }

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) { toast.error('Please enter a valid email.'); return }
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
            <Button variant='outline' className='w-full gap-2' onClick={() => toast.info('Google auth coming soon!')}>
              <IconGoogle className='size-4' /> Continue with Google
            </Button>
            <Button variant='outline' className='w-full gap-2' onClick={() => toast.info('GitHub auth coming soon!')}>
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
              We'll send a verification code to this email.
            </p>
            <div className='flex gap-2'>
              <Button type='button' variant='ghost' className='flex-1' onClick={() => setEmailStep(false)}>
                Back
              </Button>
              <Button type='submit' className='flex-1'>Continue</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
