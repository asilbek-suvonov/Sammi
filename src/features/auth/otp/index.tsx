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
import { OtpForm } from './components/otp-form'

export function Otp() {
  const search = useSearch({ strict: false }) as { email?: string }
  const email = typeof search.email === 'string' && search.email ? search.email : ''

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-base tracking-tight'>
            Tasdiqlash kodi
          </CardTitle>
          <CardDescription>
            {email ? (
              <>
                <span className='font-medium text-foreground'>{email}</span> manziliga{' '}
                tasdiqlash kodi yuborildi.
              </>
            ) : (
              'Email manzilingizga tasdiqlash kodi yuborildi.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OtpForm email={email} />
        </CardContent>
        <CardFooter>
          <p className='w-full text-center text-sm text-muted-foreground'>
            Kod kelmadimi?{' '}
            <button
              type='button'
              className='underline underline-offset-4 hover:text-primary'
              onClick={() => window.history.back()}
            >
              Qayta yuborish
            </button>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
