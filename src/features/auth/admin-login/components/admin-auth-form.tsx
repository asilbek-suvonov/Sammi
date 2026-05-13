import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthActions } from '@/stores/selectors'
import { cn } from '@/lib/utils'
import { msFromNow } from '@/lib/time'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { useAuthLogin } from '@/api-hooks/auth/index';

const REFRESH_TOKEN_KEY = 'sammi_refresh_token'

const formSchema = z.object({
  email: z.email('Please enter a valid email'),
  password: z.string().min(1, 'Please enter your password'),
})

export function AdminAuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser, setAccessToken } = useAuthActions()
  const { mutateAsync: login } = useAuthLogin()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const { access, refresh } = await login({ email: data.email, password: data.password })

      localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
      setAccessToken(access)
      setUser({
        accountNo: 'ADMIN001',
        firstName: 'Admin',
        lastName: '',
        email: data.email,
        role: 'admin',
        exp: msFromNow(24 * 60 * 60 * 1000),
      })

      toast.success('Welcome back, Admin!')
      navigate({ to: '/dashboard/overview', replace: true })
    } catch {
      // Server error toast is emitted by the global axios interceptor.
      // Mirror it onto the form fields so the inputs visually invalidate.
      form.setError('email', { message: '' })
      form.setError('password', { message: ' ' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='admin@example.com' type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='••••••••' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Admin Sign In
        </Button>
      </form>
    </Form>
  )
}
