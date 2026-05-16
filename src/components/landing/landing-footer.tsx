import { GitCommit } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const FOOTER_COLS = [
  {
    title: 'platform',
    items: [
      {
        label: 'courses',
        type: 'scroll',
        value: 'courses',
      },
      {
        label: 'projects',
        type: 'scroll',
        value: 'projects',
      },
      {
        label: 'codeSources',
        type: 'scroll',
        value: 'sources',
      },
    ],
  },

  {
    title: 'support',
    items: [
      {
        label: 'helpCenter',
        type: 'link',
        value: 'https://github.com/BekjonUz',
      },
      {
        label: 'documentation',
        type: 'link',
        value: 'https://github.com/asilbek-suvonov',
      },
      {
        label: 'community',
        type: 'link',
        value: 'https://github.com/Temurprogram77',
      },
    ],
  },

  {
    title: 'legal',
    items: [
      {
        label: 'termsOfService',
        type: 'link',
        value: 'https://github.com/SardorbekCoder07',
      },
      {
        label: 'privacyPolicy',
        type: 'link',
        value: 'https://github.com/ismat-dev',
      },
    ],
  },
]

export function LandingFooter() {
  const { t } = useTranslation()

  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
  }

  return (
    <footer className='border-t'>
      <div className='mx-auto max-w-6xl px-4 py-12 md:px-6'>
        <div className='grid gap-8 md:grid-cols-4'>
          <div className='space-y-3 md:col-span-1'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-semibold'>
                Edu Center
              </span>
            </div>

            <p className='text-sm leading-relaxed text-muted-foreground'>
              {t('footerDescription')}
            </p>
          </div>

          {FOOTER_COLS.map((col) => (
            <div
              key={col.title}
              className='space-y-3'
            >
              <p className='text-sm font-medium'>
                {t(col.title)}
              </p>

              <ul className='space-y-2'>
                {col.items.map((item) => (
                  <li key={item.label}>
                    {item.type === 'link' ? (
                      <a
                        href={item.value}
                        target='_blank'
                        rel='noreferrer'
                        className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                      >
                        {t(item.label)}
                      </a>
                    ) : (
                      <button
                        type='button'
                        onClick={() =>
                          scrollTo(item.value)
                        }
                        className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                      >
                        {t(item.label)}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='mt-10 flex flex-col items-start justify-between gap-3 border-t pt-6 text-xs text-muted-foreground md:flex-row md:items-center'>
          <span>
            © {new Date().getFullYear()} Edu Center.{' '}
            {t('footerRights')}
          </span>

          <a
            href='https://github.com'
            target='_blank'
            rel='noreferrer'
            className='flex items-center gap-1.5 transition-colors hover:text-foreground'
          >
            <GitCommit className='size-3.5' />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}