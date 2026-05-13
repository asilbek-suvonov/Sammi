import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useProfile } from '@/api-hooks/profile/use-profile'
import { useAuthActions, useAuthUser } from '@/stores/selectors'
import { useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, LogOut, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface UserNavProps {
  onSignIn: () => void
}

export function UserNav({ onSignIn }: UserNavProps) {
  const user = useAuthUser()
  const { reset } = useAuthActions()
  const { data: profile } = useProfile()
  const navigate = useNavigate()
  const { t } = useTranslation()

  if (!user) {
    return (
      <Button size='sm' className='h-8 rounded-lg text-xs' onClick={onSignIn}>
        {t('sign')}
      </Button>
    )
  }

  const isAdmin = user.role === 'admin'

  const apiFullName = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(' ')
    .trim()
  const localFullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(' ')
    .trim()
  const displayName =
    profile?.nickname ||
    apiFullName ||
    user.fullName ||
    localFullName ||
    user.email?.split('@')[0] ||
    'User'

  const avatarUrl = profile?.avatar_url || user.avatarUrl || ''
  const email = profile?.email || user.email
  const initials = (displayName[0] ?? 'U').toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-auto rounded-full p-0'>
          <Avatar className='size-8'>
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel className='space-y-1'>
          <div className='flex items-center justify-between gap-2'>
            <p className='truncate text-sm font-medium'>{displayName}</p>
            {isAdmin && (
              <Badge variant='destructive' className='shrink-0 text-[10px] px-1.5 py-0'>
                Admin
              </Badge>
            )}
          </div>
          <p className='truncate text-xs text-muted-foreground'>{email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin ? (
          <DropdownMenuItem onClick={() => navigate({ to: '/dashboard/overview' })}>
            <Shield className='size-4' /> Admin Panel
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => navigate({ to: '/dashboard/overview' })}>
            <LayoutDashboard className='size-4' /> {t('dashboard')}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant='destructive'
          onClick={() => { reset(); navigate({ to: '/' }) }}
        >
          <LogOut className='size-4' /> {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
