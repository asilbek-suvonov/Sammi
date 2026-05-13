import { useEffect, useState } from 'react'
import { Globe, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import i18n from '@/i18n/i18n'

const LANGUAGE_KEY = 'sammi_language'

const LANGUAGES = [
  { value: 'uz', label: "O'zbek" },
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
] as const

export interface LandingNavLink {
  id: string
  label: string
}

interface LandingMobileNavProps {
  links: LandingNavLink[]
  activeId: string
  onSelect: (id: string) => void
}

export function LandingMobileNav({
  links,
  activeId,
  onSelect,
}: LandingMobileNavProps) {
  const [open, setOpen] = useState(false)
  const [language, setLanguage] = useState(
    () => localStorage.getItem(LANGUAGE_KEY) ?? 'uz'
  )

  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  const handleLanguage = (value: string) => {
    setLanguage(value)
    localStorage.setItem(LANGUAGE_KEY, value)
    i18n.changeLanguage(value)
  }

  const handleLinkClick = (id: string) => {
    onSelect(id)
    setOpen(false)
  }

  return (
    <>
      <Button
        type='button'
        variant='outline'
        size='icon'
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className='size-8 md:hidden'
      >
        {open ? <X className='size-4' /> : <Menu className='size-4' />}
      </Button>

      <div
        role='presentation'
        onClick={() => setOpen(false)}
        className={cn(
          'fixed inset-0 top-14 z-40 bg-foreground/30 backdrop-blur-sm transition-opacity duration-200 md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />

      <div
        className={cn(
          'fixed inset-x-0 top-14 z-50 origin-top border-b bg-background shadow-lg transition-all duration-200 md:hidden',
          open
            ? 'opacity-100 translate-y-0'
            : 'pointer-events-none -translate-y-2 opacity-0'
        )}
      >
        <nav className='space-y-1 px-4 py-4'>
          {links.map((link) => (
            <button
              key={link.id}
              type='button'
              onClick={() => handleLinkClick(link.id)}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                activeId === link.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <span>{link.label}</span>
              <span
                className={cn(
                  'size-1.5 rounded-full transition-colors',
                  activeId === link.id ? 'bg-primary' : 'bg-transparent'
                )}
              />
            </button>
          ))}
        </nav>

        <div className='border-t bg-muted/30 px-4 py-4'>
          <div className='mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground'>
            <Globe className='size-3.5' />
            Language
          </div>
          <div className='grid grid-cols-3 gap-2'>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                type='button'
                onClick={() => handleLanguage(lang.value)}
                className={cn(
                  'rounded-lg border px-2 py-2 text-xs font-medium transition-colors',
                  language === lang.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground'
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
