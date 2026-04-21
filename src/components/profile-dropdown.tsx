import { Link } from '@tanstack/react-router'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { useAuthStore } from '@/stores/auth-store'
import { Badge } from '@/components/ui/badge'

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState()
  const { auth } = useAuthStore()
  const user = auth.user

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email.split('@')[0]
    : 'Foydalanuvchi'

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src='/avatars/01.png' alt={displayName} />
              <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-60' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              <div className='flex items-center gap-2'>
                <p className='text-sm font-medium leading-none'>{displayName}</p>
                <Badge
                  variant={user?.role === 'admin' ? 'default' : 'secondary'}
                  className='h-4 px-1.5 text-[10px]'
                >
                  {user?.role === 'admin' ? 'Admin' : 'User'}
                </Badge>
              </div>
              <p className='truncate text-xs leading-none text-muted-foreground'>
                {user?.email}
              </p>
              {user?.accountNo && (
                <p className='text-[10px] leading-none text-muted-foreground'>
                  #{user.accountNo}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to='/settings'>
                Profil
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings'>
                Sozlamalar
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setOpen(true)}>
            Chiqish
            <DropdownMenuShortcut className='text-current'>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
