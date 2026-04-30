import { useState, type ReactNode } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useGoogleAuth } from '@/api-hooks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAuthActions } from '@/stores/selectors'

const REFRESH_TOKEN_KEY = 'sammi_refresh_token'

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
  description = 'Sign in with your Google account to access this course.',
  open: controlledOpen,
  onOpenChange,
}: LoginDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const { setUser, setAccessToken } = useAuthActions()

  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  const { mutate: authenticateWithGoogle, isPending } = useGoogleAuth({
    onSuccess: (data) => {
      const { access, refresh } = data

      localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
      setAccessToken(access)
      setUser({
        accountNo: `USR-${Date.now()}`,
        firstName: 'User',
        lastName: '',
        email: '',
        role: 'user',
        exp: Date.now() + 24 * 60 * 60 * 1000,
      })

      setOpen(false)
      toast.success('Successfully signed in!')
      onSuccess?.()
    },
    onError: () => {
      toast.error('Sign in failed — please try again.')
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col items-center gap-4 py-2'>
          {isPending ? (
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Loader2 className='h-4 w-4 animate-spin' />
              <span>Signing in...</span>
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
                toast.error('Google sign in was cancelled.')
              }}
              size='large'
              width='350'
              text='continue_with'
              shape='rectangular'
              theme='outline'
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
