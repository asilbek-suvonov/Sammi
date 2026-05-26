import {
  BookOpen,
  FolderGit2,
  FileText,
  ShieldCheck,
  LifeBuoy,
  Users,
  ScrollText,
  Code2,
  ArrowUpRight,
} from 'lucide-react'

import { useTranslation } from 'react-i18next'

const FOOTER_COLS = [
  {
    title: 'platform',

    items: [
      {
        label: 'courses',
        type: 'scroll',
        value: 'courses',
        icon: BookOpen,
      },

      {
        label: 'projects',
        type: 'scroll',
        value: 'projects',
        icon: FolderGit2,
      },

      {
        label: 'codeSources',
        type: 'scroll',
        value: 'sources',
        icon: Code2,
      },
    ],
  },

  {
    title: 'support',

    items: [
      {
        label: 'helpCenter',
        type: 'link',
        value: '#',
        icon: LifeBuoy,
      },

      {
        label: 'documentation',
        type: 'link',
        value: '#',
        icon: FileText,
      },

      {
        label: 'community',
        type: 'link',
        value: '#',
        icon: Users,
      },
    ],
  },

  {
    title: 'legal',

    items: [
      {
        label: 'termsOfService',
        type: 'link',
        value: '#',
        icon: ScrollText,
      },

      {
        label: 'privacyPolicy',
        type: 'link',
        value: '#',
        icon: ShieldCheck,
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
    <footer className='border-t bg-muted/20'>
      <div className='mx-auto max-w-6xl px-4 py-14 md:px-6'>
        <div className='grid gap-10 md:grid-cols-2 lg:grid-cols-4'>
          <div className='space-y-5'>
            <div className='flex items-center gap-2'>
              <div className='flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                <BookOpen className='size-5' />
              </div>

              <div>
                <h2 className='text-lg font-bold'>
                  Edu Center
                </h2>

                <p className='text-xs text-muted-foreground'>
                  Learning Platform
                </p>
              </div>
            </div>

            <p className='text-sm leading-6 text-muted-foreground'>
              {t('footerDescription')}
            </p>

          </div>

          {FOOTER_COLS.map((col) => (
            <div
              key={col.title}
              className='space-y-4'
            >
              <h3 className='text-sm font-semibold uppercase tracking-wide text-foreground/90'>
                {t(col.title)}
              </h3>

              <ul className='space-y-3'>
                {col.items.map((item) => {
                  const Icon = item.icon

                  return (
                    <li key={item.label}>
                      {item.type === 'link' ? (
                        <a
                          href={item.value}
                          target='_blank'
                          rel='noreferrer'
                          className='group flex items-center justify-between rounded-lg px-2 py-2 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-foreground'
                        >
                          <div className='flex items-center gap-2'>
                            <Icon className='size-4' />

                            <span>
                              {t(item.label)}
                            </span>
                          </div>

                          <ArrowUpRight className='size-3.5 opacity-0 transition-opacity group-hover:opacity-100' />
                        </a>
                      ) : (
                        <button
                          type='button'
                          onClick={() =>
                            scrollTo(item.value)
                          }
                          className='group flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-foreground'
                        >
                          <div className='flex items-center gap-2'>
                            <Icon className='size-4' />

                            <span>
                              {t(item.label)}
                            </span>
                          </div>

                          <ArrowUpRight className='size-3.5 opacity-0 transition-opacity group-hover:opacity-100' />
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className='mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground md:flex-row'>
          <p>
            © {new Date().getFullYear()} Edu
            Center. {t('footerRights')}
          </p>
        </div>
      </div>
    </footer>
  )
}