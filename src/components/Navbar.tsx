import { Link, useNavigate } from '@tanstack/react-router'
import { 
  Zap, Languages, Sun, Moon, Monitor, 
  LayoutDashboard, LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/auth-store'
import { useTheme } from '@/context/theme-provider'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n/i18n'

const LANGUAGE_STORAGE_KEY = 'sammi_language'

interface NavbarProps {
  language: string
  setLanguage: (val: string) => void
  active?: string
  navLinks?: { id: string; label: string }[]
  scrollToSection?: (id: string) => void
}

export default function Navbar({ 
  language, 
  setLanguage, 
  active, 
  navLinks, 
  scrollToSection 
}: NavbarProps) {
  const { auth } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = auth.user

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, value)
    i18n.changeLanguage(value)
  }

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className='size-4' />
    if (theme === 'dark') return <Moon className='size-4' />
    return <Monitor className='size-4' />
  }

  const initials = (user?.firstName?.[0] ?? user?.email?.[0] ?? 'U').toUpperCase()

  return (
    <header className='sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6'>
        
        {/* Logo */}
        <Link to="/" className='flex items-center gap-2'>
          <div className='flex size-7 items-center justify-center rounded-md bg-foreground'>
            <Zap className='size-3.5 text-background' />
          </div>
          <span className='text-sm font-semibold tracking-tight'>Sammi</span>
        </Link>

        <nav className='hidden items-center gap-0.5 md:flex'>
          
          {navLinks ? (
            navLinks.map((link) => (
              <button
                type='button'
                key={link.id}
                onClick={() => scrollToSection?.(link.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  active === link.id 
                    ? 'text-foreground bg-accent' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </button>
            ))
          ) : (
            <>
              <Link to="/" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                {t('navCourses')}
              </Link>
              <Link to="/" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                {t('navProjects')}
              </Link>
              <Link to="/" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                {t('navSources')}
              </Link>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className='flex items-center gap-2'>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className='hidden h-8 w-[110px] gap-1.5 text-xs md:flex'>
              <Languages className='size-3.5 shrink-0' />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='en'>English</SelectItem>
              <SelectItem value='uz'>Uzbek</SelectItem>
              <SelectItem value='ru'>Russian</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant='outline' 
            size='icon' 
            className='size-8' 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {getThemeIcon()}
          </Button>

          {user ? (
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
                  <p className='truncate text-sm'>{`${user.firstName || ''} ${user.lastName || ''}`}</p>
                  <p className='text-xs text-muted-foreground'>{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: '/dashboard/overview' })}>
                  <LayoutDashboard className='size-4 mr-2' /> {t('dashboard')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-500" 
                  onClick={() => { auth.reset(); navigate({ to: '/' }) }}
                >
                  <LogOut className='size-4 mr-2' /> {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size='sm' className='h-8 rounded-lg text-xs'>
              <Link to='/login'>{t('sign')}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}