import { CoursesSection } from '@/components/landing/courses-section'
import HeroSection from '@/components/landing/hero-section'
import { LandingFooter } from '@/components/landing/landing-footer'
import { ProjectsSection } from '@/components/landing/projects-section'
import { SourcesSection } from '@/components/landing/sources-section'
import { PublicHeader } from '@/components/public/public-header'
import { PublicNavRight } from '@/components/public/public-nav-right'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function LandingPage() {
  const [active, setActive] = useState('courses')
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

  return (
    <div className='min-h-screen bg-background text-foreground'>
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
        right={<PublicNavRight />}
      />

      <div className='border-b' />
        <HeroSection />
      <main className='mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-16 md:px-6'>
        <CoursesSection />
        <ProjectsSection />
        <SourcesSection />
      </main>

      <LandingFooter />
    </div>
  )
}
