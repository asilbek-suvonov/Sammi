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
import { useAuthStore } from '@/stores/auth-store'
import { useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, LogOut, Shield } from 'lucide-react'
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
  const isAdmin = user.role === 'admin'

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
        <DropdownMenuLabel className='space-y-1'>
          <div className='flex items-center justify-between gap-2'>
            <p className='truncate text-sm font-medium'>{`${user.firstName} ${user.lastName}`}</p>
            {isAdmin && (
              <Badge variant='destructive' className='shrink-0 text-[10px] px-1.5 py-0'>
                Admin
              </Badge>
            )}
          </div>
          <p className='truncate text-xs text-muted-foreground'>{user.email}</p>
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
          onClick={() => { auth.reset(); navigate({ to: '/' }) }}
        >
          <LogOut className='size-4' /> {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
