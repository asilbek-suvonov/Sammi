import { CoursesSection } from '@/components/landing/courses-section'
import { LandingFooter } from '@/components/landing/landing-footer'
import { ProjectsSection } from '@/components/landing/projects-section'
import { SourcesSection } from '@/components/landing/sources-section'
import { PublicHeader } from '@/components/public/public-header'
import { SignInDialog } from '@/components/public/sign-in-dialog'
import { ThemeToggle } from '@/components/public/theme-toggle'
import { UserNav } from '@/components/public/user-nav'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import i18n from '@/i18n/i18n'
import { Languages } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const LANGUAGE_KEY = 'sammi_language'

export function LandingPage() {
  const [active, setActive] = useState('courses')
  const [language, setLanguage] = useState(() => localStorage.getItem(LANGUAGE_KEY) ?? 'en')
  const [signInOpen, setSignInOpen] = useState(false)
  const { t } = useTranslation()

  const navLinks = [
    { id: 'courses', label: t('navCourses') },
    { id: 'projects', label: t('navProjects') },
    { id: 'sources', label: t('navSources') },
  ]

  const linkClass = useMemo(
    () => (id: string) =>
      `px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 ${
        active === id ? 'text-gray-900/80 bg-white' : 'text-muted-foreground hover:text-foreground'
      }`,
    [active]
  )

  const scrollTo = (id: string) => {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleLanguage = (value: string) => {
    setLanguage(value)
    localStorage.setItem(LANGUAGE_KEY, value)
    i18n.changeLanguage(value)
  }

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />

      <PublicHeader
        center={
          <nav className='hidden items-center gap-0.5 md:flex'>
            {navLinks.map((link) => (
              <button
                type='button'
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={linkClass(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>
        }
        right={
          <>
            <Select value={language} onValueChange={handleLanguage}>
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
            <ThemeToggle />
            <UserNav onSignIn={() => setSignInOpen(true)} />
          </>
        }
      />

      <div className='border-b' />

      <main className='mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-16 md:px-6'>
        <CoursesSection />
        <ProjectsSection />
        <SourcesSection />
      </main>

      <LandingFooter />
    </div>
  )
}
