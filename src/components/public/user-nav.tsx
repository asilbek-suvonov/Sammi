import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/auth-store'
import { useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface UserNavProps {
  onSignIn: () => void
}

export function UserNav({ onSignIn }: UserNavProps) {
  const { auth } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const user = auth.user

  if (!user) {
    return (
      <Button size='sm' className='h-8 rounded-lg text-xs' onClick={onSignIn}>
        {t('sign')}
      </Button>
    )
  }

  const initials = (user.firstName?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-auto rounded-full p-0'>
          <Avatar className='size-8'>
            <AvatarImage src='/avatars/shadcn.jpg' alt={user.email} />
            <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel>
          <p className='truncate text-sm'>{`${user.firstName} ${user.lastName}`}</p>
          <p className='text-xs text-muted-foreground'>{user.email}</p>
          <p className='capitalize text-xs text-muted-foreground'>Role: {user.role}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: '/dashboard/overview' })}>
          <LayoutDashboard className='size-4' /> {t('dashboard')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant='destructive'
          onClick={() => { auth.reset(); navigate({ to: '/' }) }}
        >
          <LogOut className='size-4' /> {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
