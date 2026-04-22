import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'

const MOCK_OTP = '123456'

const formSchema = z.object({
  otp: z
    .string()
    .min(6, 'Please enter the 6-digit code.')
    .max(6, 'Please enter the 6-digit code.'),
})

type OtpFormProps = React.HTMLAttributes<HTMLFormElement>

export function OtpForm({ className, ...props }: OtpFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const otp = form.watch('otp')

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (data.otp !== MOCK_OTP) {
      form.setError('otp', { message: 'Invalid code. Hint: use 123456' })
      return
    }

    setIsLoading(true)
    const email = sessionStorage.getItem('sammi_pending_email') ?? 'user@sammi.local'

    setTimeout(() => {
      const newUser = {
        accountNo: `USER-${Date.now()}`,
        firstName: email.split('@')[0] ?? 'User',
        lastName: '',
        email,
        role: 'user' as const,
        exp: Date.now() + 24 * 60 * 60 * 1000,
      }
      auth.setUser(newUser)
      auth.setAccessToken('mock-user-token')
      sessionStorage.removeItem('sammi_pending_email')
      setIsLoading(false)
      toast.success(`Welcome, ${newUser.firstName}!`)
      navigate({ to: '/' })
    }, 1000)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-4', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='otp'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='sr-only'>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  containerClassName='justify-between sm:[&>[data-slot="input-otp-group"]>div]:w-12'
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className='text-xs text-muted-foreground text-center'>
          For demo purposes use: <span className='font-mono font-semibold'>123456</span>
        </p>
        <Button className='mt-2' disabled={otp.length < 6 || isLoading}>
          {isLoading && <Loader2 className='animate-spin' />}
          Verify
        </Button>
      </form>
    </Form>
  )
}
