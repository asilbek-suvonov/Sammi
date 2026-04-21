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

const ADMIN_LOGIN = 'Asilbek7712'
const ADMIN_PASSWORD = 'Asil2008'

const formSchema = z.object({
  login: z.string().min(1, 'Login kiriting'),
  password: z.string().min(1, 'Parolni kiriting'),
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
      login: '',
      password: '',
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (data.login !== ADMIN_LOGIN || data.password !== ADMIN_PASSWORD) {
      form.setError('login', { message: 'Noto\'g\'ri login yoki parol' })
      form.setError('password', { message: 'Login yoki parolni tekshiring' })
      return
    }

    setIsLoading(true)
    toast.promise(sleep(1200), {
      loading: 'Admin sifatida kirilmoqda...',
      success: () => {
        const mockUser = {
          accountNo: 'ADMIN001',
          firstName: 'Asilbek',
          lastName: '',
          email: 'asilbek@sammi.local',
          role: 'admin' as const,
          exp: Date.now() + 24 * 60 * 60 * 1000,
        }

        auth.setUser(mockUser)
        auth.setAccessToken('mock-admin-token')
        setIsLoading(false)
        navigate({ to: '/dashboard/overview', replace: true })
        return 'Xush kelibsiz, Admin!'
      },
      error: () => {
        setIsLoading(false)
        return 'Kirib bo\'lmadi'
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
          name='login'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Login</FormLabel>
              <FormControl>
                <Input placeholder='Admin login' autoComplete='username' {...field} />
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
              <FormLabel>Parol</FormLabel>
              <FormControl>
                <PasswordInput placeholder='••••••••' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Admin kirish
        </Button>
      </form>
    </Form>
  )
}
