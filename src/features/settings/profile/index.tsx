import { Link } from '@tanstack/react-router'
import {
  AtSign,
  CalendarDays,
  IdCard,
  Loader2,
  Pencil,
  UserRound,
} from 'lucide-react'
import { useProfile } from '@/api-hooks/profile/use-profile'
import type { Profile } from '@/service/profile/profile.types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

function formatDate(iso?: string) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound
  label: string
  value: string
}) {
  return (
    <div className='flex items-start gap-3'>
      <div className='mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground'>
        <Icon className='size-4' />
      </div>
      <div className='min-w-0 flex-1'>
        <p className='text-xs uppercase tracking-wide text-muted-foreground'>
          {label}
        </p>
        <p className='break-words text-sm font-medium'>{value || '—'}</p>
      </div>
    </div>
  )
}

function ProfileBody({ profile }: { profile: Profile }) {
  const displayName =
    [profile.first_name, profile.last_name].filter(Boolean).join(' ') ||
    profile.nickname ||
    profile.email
  const initials = (
    profile.first_name?.[0] ||
    profile.nickname?.[0] ||
    profile.email?.[0] ||
    'U'
  ).toUpperCase()

  return (
    <div className='w-full max-w-2xl space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-6'>
        <div className='flex items-center gap-4'>
          <Avatar className='size-16 border-2 border-border'>
            <AvatarImage src={profile.avatar_url ?? undefined} />
            <AvatarFallback className='text-xl font-semibold'>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className='min-w-0'>
            <p className='truncate text-lg font-semibold'>{displayName}</p>
            <p className='truncate text-sm text-muted-foreground'>
              @{profile.username || profile.email.split('@')[0]}
            </p>
          </div>
        </div>
        <Button asChild size='sm' variant='outline' className='gap-1.5'>
          <Link to='/settings/account'>
            <Pencil className='size-3.5' />
            Edit
          </Link>
        </Button>
      </div>

      <div className='space-y-1 rounded-xl border bg-card p-6'>
        <h2 className='text-sm font-semibold'>Personal information</h2>
        <p className='text-xs text-muted-foreground'>
          Hisobingiz haqida ma&apos;lumotlar. Tahrirlash uchun{' '}
          <Link
            to='/settings/account'
            className='text-primary underline-offset-2 hover:underline'
          >
            Account
          </Link>{' '}
          sahifasiga o&apos;ting.
        </p>
        <Separator className='my-4' />
        <div className='grid gap-5 sm:grid-cols-2'>
          <InfoRow
            icon={UserRound}
            label='Full name'
            value={
              [profile.first_name, profile.last_name].filter(Boolean).join(' ')
            }
          />
          <InfoRow icon={IdCard} label='Nickname' value={profile.nickname} />
          <InfoRow icon={AtSign} label='Email' value={profile.email} />
          <InfoRow icon={AtSign} label='Username' value={profile.username} />
          <InfoRow
            icon={CalendarDays}
            label='Joined'
            value={formatDate(profile.created_at)}
          />
          <InfoRow
            icon={CalendarDays}
            label='Last updated'
            value={formatDate(profile.updated_at)}
          />
        </div>

        {profile.bio && (
          <>
            <Separator className='my-4' />
            <div>
              <p className='text-xs uppercase tracking-wide text-muted-foreground'>
                Bio
              </p>
              <p className='mt-1 whitespace-pre-wrap text-sm leading-relaxed'>
                {profile.bio}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function SettingsProfile() {
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
        <Button size='sm' variant='outline' onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  return <ProfileBody profile={data} />
}
