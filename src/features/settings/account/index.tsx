import { Loader2 } from 'lucide-react'
import { useProfile } from '@/api-hooks/profile/use-profile'
import { Separator } from '@/components/ui/separator'
import { AvatarSection } from './avatar-section'
import { PasswordForm } from './password-form'
import { ProfileForm } from './profile-form'

export function SettingsAccount() {
  const { data, isLoading, isError, refetch } = useProfile()

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='size-5 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className='flex h-64 flex-col items-center justify-center gap-3 text-sm'>
        <p className='text-muted-foreground'>Failed to load profile.</p>
        <button
          type='button'
          onClick={() => refetch()}
          className='text-primary hover:underline'
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className='w-full max-w-2xl space-y-8 overflow-y-auto'>
      <AvatarSection profile={data} />
      <Separator />
      <ProfileForm profile={data} />
      <Separator />
      <PasswordForm />
    </div>
  )
}
