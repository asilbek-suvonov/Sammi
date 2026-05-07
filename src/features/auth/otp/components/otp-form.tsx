import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { useAuthStore, type AuthUser } from '@/stores/auth-store'
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

import { useVerifyOtp } from '@/api-hooks/auth/userOTP/use-OTP'

import type { VerifyOtpResponse } from '@/service/auth/OTP/userOTP.type'

const formSchema = z.object({
  otp: z
    .string()
    .min(6, 'Please enter the 6-digit code.')
    .max(6, 'Please enter the 6-digit code.'),
})

const parseFullName = (fullName?: string): { firstName: string; lastName: string } => {
  if (!fullName) return { firstName: '', lastName: '' }
  const parts = fullName.trim().split(' ')
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  }
}

const toAuthUser = (data: VerifyOtpResponse): AuthUser => {
  const { firstName, lastName } = parseFullName(data.full_name)

  return {
    id: data.id ?? 0,
    email: data.email,
    firstName,
    lastName,
    fullName: data.full_name,
    avatarUrl: data.avatar_url,
    country: data.country,
    languageCode: data.language_code,
    isNewUser: data.is_new_user,
    role: 'user',
  }
}

type OtpFormProps = React.HTMLAttributes<HTMLFormElement>

export function OtpForm({ className, ...props }: OtpFormProps) {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.auth.login)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  const verifyOtpMutation = useVerifyOtp({
    onSuccess: (data) => {
      login({
        accessToken: data.access,
        refreshToken: data.refresh ?? '',
        user: toAuthUser(data),
      })
      sessionStorage.removeItem('sammi_pending_email')
      toast.success('Muvaffaqiyatli tasdiqlandi!')
      navigate({ to: '/' })
    },
  })

  const otp = form.watch('otp')

  function onSubmit(values: z.infer<typeof formSchema>) {
    const email = sessionStorage.getItem('sammi_pending_email')

    if (!email) {
      toast.error('Email topilmadi')
      navigate({ to: '/' })
      return
    }

    verifyOtpMutation.mutate({ email, otp: values.otp })
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
                  value={field.value}
                  onChange={field.onChange}
                  disabled={verifyOtpMutation.isPending}
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

        <Button
          type='submit'
          className='mt-2'
          disabled={otp.length < 6 || verifyOtpMutation.isPending}
        >
          {verifyOtpMutation.isPending && (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          )}
          {verifyOtpMutation.isPending ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
        </Button>
      </form>
    </Form>
  )
}
