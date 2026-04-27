import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth-store'

interface LoginDialogProps {
  trigger?: ReactNode
  onSuccess?: () => void
  title?: string
  description?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function LoginDialog({
  trigger,
  onSuccess,
  title = 'Sign in to continue',
  description = 'Enter your details to access this course.',
  open: controlledOpen,
  onOpenChange,
}: LoginDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { auth } = useAuthStore()

  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const firstName = String(data.get('firstName') || '').trim()
    const email = String(data.get('email') || '').trim()
    if (!firstName || !email) {
      toast.error('Please fill all fields.')
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      auth.setUser({
        accountNo: `USR-${Date.now()}`,
        firstName,
        lastName: '',
        email,
        role: 'user',
        exp: Date.now() + 24 * 60 * 60 * 1000,
      })
      auth.setAccessToken('mock-user-token')
      setSubmitting(false)
      setOpen(false)
      toast.success(`Welcome, ${firstName}!`)
      onSuccess?.()
    }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='login-name'>First name</Label>
            <Input id='login-name' name='firstName' placeholder='Your name' required />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='login-email'>Email</Label>
            <Input id='login-email' name='email' type='email' placeholder='you@example.com' required />
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type='submit' disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
