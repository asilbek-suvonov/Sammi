import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn, sleep } from '@/lib/utils'
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

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(7, 'Password must be at least 7 characters long'),
})

export function AdminAuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const usersRaw = localStorage.getItem('sammi_mock_users')
    const users = usersRaw
      ? (JSON.parse(usersRaw) as Array<{ email: string; password: string; role: 'user' | 'admin'; firstName: string; lastName: string }>)
      : []

    if (!users.some((item) => item.role === 'admin')) {
      users.push({
        email: 'admin@sammi.local',
        password: 'admin1234',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
      })
      localStorage.setItem('sammi_mock_users', JSON.stringify(users))
    }

    const adminUser = users.find(
      (user) =>
        user.role === 'admin' &&
        user.email === data.email &&
        user.password === data.password
    )

    if (!adminUser) {
      form.setError('email', { message: 'Invalid admin credentials' })
      form.setError('password', { message: 'Please check email/password' })
      return
    }

    setIsLoading(true)
    toast.promise(sleep(1200), {
      loading: 'Signing in as admin...',
      success: () => {
        const mockUser = {
          accountNo: 'ADMIN001',
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          email: adminUser.email,
          role: 'admin' as const,
          exp: Date.now() + 24 * 60 * 60 * 1000,
        }

        auth.setUser(mockUser)
        auth.setAccessToken('mock-access-token')
        setIsLoading(false)
        navigate({ to: '/dashboard/overview', replace: true })
        return 'Welcome back, admin!'
      },
      error: () => {
        setIsLoading(false)
        return 'Could not sign in'
      },
    })
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
              <FormLabel>Admin Email</FormLabel>
              <FormControl>
                <Input placeholder='admin@example.com' {...field} />
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
                <PasswordInput placeholder='********' {...field} />
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
