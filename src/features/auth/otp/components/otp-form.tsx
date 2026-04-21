import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
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

const formSchema = z.object({
  otp: z
    .string()
    .min(6, '6 raqamli kodni kiriting.')
    .max(6, '6 raqamli kodni kiriting.'),
})

interface OtpFormProps extends React.HTMLAttributes<HTMLFormElement> {
  email?: string
}

export function OtpForm({ className, email = '', ...props }: OtpFormProps) {
  const navigate = useNavigate()
  const { auth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  const otp = form.watch('otp')

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    setTimeout(() => {
      // Mock: accept any 6-digit code
      if (data.otp.length === 6) {
        const resolvedEmail = email || sessionStorage.getItem('sammi_otp_email') || 'user@sammi.local'
        const namePart = resolvedEmail.split('@')[0] ?? 'User'

        const mockUser = {
          accountNo: `OTP_${Date.now()}`,
          firstName: namePart,
          lastName: '',
          email: resolvedEmail,
          role: 'user' as const,
          exp: Date.now() + 24 * 60 * 60 * 1000,
        }

        auth.setUser(mockUser)
        auth.setAccessToken('mock-otp-token')
        sessionStorage.removeItem('sammi_otp_email')

        toast.success('Muvaffaqiyatli kirildi!')
        navigate({ to: '/' })
      } else {
        form.setError('otp', { message: 'Noto\'g\'ri kod. Qayta urinib ko\'ring.' })
        setIsLoading(false)
      }
    }, 1200)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='otp'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='sr-only'>Bir martalik parol</FormLabel>
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
        <Button className='mt-2' disabled={otp.length < 6 || isLoading}>
          {isLoading ? <Loader2 className='size-4 animate-spin' /> : null}
          Tasdiqlash
        </Button>
      </form>
    </Form>
  )
}
