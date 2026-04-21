import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { AdminAuthForm } from './components/admin-auth-form'

export function AdminLogin() {
  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight text-center'>
            Admin Login
          </CardTitle>
          <CardDescription className='text-center'>
            Admin panelga kirish uchun email va password kiriting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminAuthForm />
        </CardContent>
        <CardFooter>
          <p className='w-full text-center text-sm text-muted-foreground'>
            Faqat admin foydalanuvchilar uchun.
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
