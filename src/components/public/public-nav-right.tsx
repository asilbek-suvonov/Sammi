import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import i18n from '@/i18n/i18n'
import { Languages } from 'lucide-react'
import { useState } from 'react'
import { SignInDialog } from './sign-in-dialog'
import { ThemeToggle } from './theme-toggle'
import { UserNav } from './user-nav'

const LANGUAGE_KEY = 'sammi_language'

export function PublicNavRight() {
  const [language, setLanguage] = useState(() => localStorage.getItem(LANGUAGE_KEY) ?? 'en')
  const [signInOpen, setSignInOpen] = useState(false)

  const handleLanguage = (value: string) => {
    setLanguage(value)
    localStorage.setItem(LANGUAGE_KEY, value)
    i18n.changeLanguage(value)
  }

  return (
    <>
      <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />
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
  )
}
