import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'

const codeLines = [
  `import { useState, useEffect } from 'react'`,
  `import { AuthUser } from '@/types'`,
  ``,
  `// Custom auth hook`,
  `export function useAuth() {`,
  `  const [user, setUser] =`,
  `    useState<AuthUser | null>(null)`,
  ``,
  `  useEffect((() => {`,
  `    // fetch session`,
  `    getSession().then(setUser)`,
  `  }, [])`,
  ``,
  `  return { user }`,
  `}`,
]

const syntaxHighlight = (line: string) => {
  return line
    .replace(/(import|export|const|function|return|from)/g, '<span class="text-indigo-400">$1</span>')
    .replace(/('.*?')/g, '<span class="text-orange-400">$1</span>')
    .replace(/(useState|useEffect|getSession|useAuth)/g, '<span class="text-emerald-400">$1</span>')
    .replace(/(\/\/.*)/g, '<span class="text-zinc-500 italic">$1</span>')
    .replace(/(AuthUser)/g, '<span class="text-sky-400">$1</span>')
}

export default function HeroSection() {
  const { t } = useTranslation()
  const s1Ref = useRef<HTMLSpanElement>(null)
  const s2Ref = useRef<HTMLSpanElement>(null)
  const s3Ref = useRef<HTMLSpanElement>(null)

  const countTo = (el: HTMLSpanElement, target: number, duration: number) => {
    let start = 0
    const step = target / (duration / 16)
    const interval = setInterval(() => {
      start = Math.min(start + step, target)
      const v = Math.round(start)
      el.textContent = v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(v)
      if (start >= target) clearInterval(interval)
    }, 16)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (s1Ref.current) countTo(s1Ref.current, 5200, 1200)
      if (s2Ref.current) countTo(s2Ref.current, 24, 900)
      if (s3Ref.current) countTo(s3Ref.current, 60, 1000)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className='border-b-[-3rem] bg-background mt-[-2rem]'>
      <div className='mx-auto grid max-w-full grid-cols-1 items-center gap-12 px-4 py-16 md:grid-cols-2 md:px-6'>
        <div className='flex flex-col gap-6 animate-fade-up'>
          <div className='flex w-fit items-center gap-2 rounded-full border border-border bg-muted px-3 py-1'>
            <span className='size-2 animate-pulse rounded-full bg-emerald-500' />
            <span className='text-xs text-muted-foreground'>{t('heroBadge')}</span>
          </div>
          <h1 className='text-3xl font-medium leading-tight tracking-tight md:text-4xl'>
            {t('heroTitle1')}{' '}
            <span className='text-indigo-500'>{t('heroTitleHighlight')}</span>
            <br />
            {t('heroTitle2')}
          </h1>
          <p className='max-w-sm text-sm leading-relaxed text-muted-foreground'>
            {t('heroSubtitle')}
          </p>
          <div className='flex flex-wrap gap-3'>
            <Link
              to='/login'
              className='rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80'
            >
              {t('heroCta')}
            </Link>
            <button
              type='button'
              className='rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted'
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('heroSecondary')} →
            </button>
          </div>
          <div className='flex gap-8 pt-2'>
            <div>
              <p className='text-xl font-medium'><span ref={s1Ref}>0</span></p>
              <p className='text-xs text-muted-foreground'>{t('heroStat1')}</p>
            </div>
            <div>
              <p className='text-xl font-medium'><span ref={s2Ref}>0</span></p>
              <p className='text-xs text-muted-foreground'>{t('heroStat2')}</p>
            </div>
            <div>
              <p className='text-xl font-medium'><span ref={s3Ref}>0</span></p>
              <p className='text-xs text-muted-foreground'>{t('heroStat3')}</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='animate-float overflow-hidden rounded-xl border border-border bg-zinc-950 shadow-lg'>
            <div className='flex items-center gap-1.5 border-b border-white/10 bg-zinc-900 px-3 py-2.5'>
              <span className='size-2.5 rounded-full bg-red-500' />
              <span className='size-2.5 rounded-full bg-yellow-400' />
              <span className='size-2.5 rounded-full bg-green-500' />
              <span className='ml-3 rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400'>
                useAuth.ts
              </span>
            </div>
            <div className='overflow-x-auto p-4 font-mono text-[11.5px] leading-relaxed'>
              {codeLines.map((line, i) => (
                <div
                  key={i}
                  className='flex gap-4 opacity-0'
                  style={{ animation: `fadeInUp 0.3s ease forwards`, animationDelay: `${i * 0.06 + 0.1}s` }}
                >
                  <span className='w-4 shrink-0 text-right text-zinc-600 select-none'>{line ? i + 1 : ''}</span>
                  <span
                    className='text-zinc-300'
                    dangerouslySetInnerHTML={{ __html: syntaxHighlight(line) || '&nbsp;' }}
                  />
                  {i === codeLines.length - 1 && (
                    <span className='inline-block h-3.5 w-0.5 animate-blink bg-zinc-300 align-middle' />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className='rounded-lg border border-border bg-card p-3.5 opacity-0' style={{ animation: 'fadeInUp 0.4s ease .8s forwards' }}>
            <p className='text-xs leading-relaxed text-muted-foreground'>
              Token refresh logikangizda xatolik bor.{' '}
              <code className='rounded bg-muted px-1 py-0.5 font-mono text-[10.5px] text-foreground'>expires_in</code>{' '}
              ni tekshirishni unutgansiz.
            </p>
            <div className='mt-2 rounded bg-muted px-2.5 py-1.5 font-mono text-[10.5px]'>
              if (Date.now() {'>'} token.expires_in) refresh()
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .animate-float { animation: float 3.5s ease-in-out infinite; }
        .animate-blink  { animation: blink 0.9s step-end infinite; }
        .animate-fade-up { animation: fadeInUp 0.5s ease forwards; }
      `}</style>
    </section>
  )
}