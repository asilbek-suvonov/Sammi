import { useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserAuthForm } from './components/user-auth-form'
import { SignUpForm } from '../sign-up/components/sign-up-form'

export function SignIn() {
  const search = useSearch({ strict: false })
  const redirect = typeof search.redirect === 'string' ? search.redirect : undefined

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight text-center'>
            User Authentication
          </CardTitle>
          <CardDescription className='text-center'>
            Sign in or create a new user account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='sign-in' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='sign-in'>Sign In</TabsTrigger>
              <TabsTrigger value='sign-up'>Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value='sign-in' className='pt-4'>
              <UserAuthForm redirectTo={redirect} />
            </TabsContent>
            <TabsContent value='sign-up' className='pt-4'>
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            By clicking sign in, you agree to our{' '}
            <a
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
