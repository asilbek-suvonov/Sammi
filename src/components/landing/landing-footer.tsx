import { GitCommit } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const FOOTER_COLS = [
  { title: 'Platform', items: ['Courses', 'Projects', 'Code Sources'] },
  { title: 'Support', items: ['Help Center', 'Documentation', 'Community'] },
  { title: 'Legal', items: ['Terms of Service', 'Privacy Policy'] },
]

export function LandingFooter() {
  const { t } = useTranslation()
  return (
    <footer className='border-t'>
      <div className='mx-auto max-w-6xl px-4 py-12 md:px-6'>
        <div className='grid gap-8 md:grid-cols-4'>
          <div className='space-y-3 md:col-span-1'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-semibold'>Edu Center</span>
            </div>
            <p className='text-sm leading-relaxed text-muted-foreground'>
              {t('footerDescription')}
            </p>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.title} className='space-y-3'>
              <p className='text-sm font-medium'>{col.title}</p>
              <ul className='space-y-2'>
                {col.items.map((item) => (
                  <li
                    key={item}
                    className='cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground'
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='mt-10 flex flex-col items-start justify-between gap-3 border-t pt-6 text-xs text-muted-foreground md:flex-row md:items-center'>
          <span>© {new Date().getFullYear()} Edu center. {t('footerRights')}</span>
          <a
            href='https://github.com'
            target='_blank'
            rel='noreferrer'
            className='flex items-center gap-1.5 transition-colors hover:text-foreground'
          >
            <GitCommit className='size-3.5' /> GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
