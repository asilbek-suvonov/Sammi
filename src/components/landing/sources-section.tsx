import { SourceCard } from '@/components/cards/source-card'
import { SOURCES } from '@/data/mock-data'
import { useTranslation } from 'react-i18next'

export function SourcesSection() {
  const { t } = useTranslation()
  return (
    <section id='sources' className='space-y-6'>
      <div className='space-y-0.5'>
        <h2 className='text-xl font-semibold tracking-tight'>{t('sourcesTitle')}</h2>
        <p className='text-sm text-muted-foreground'>{t('sourcesSubtitle')}</p>
      </div>
      <div className='grid gap-4 md:grid-cols-3'>
        {SOURCES.map((source) => (
          <SourceCard key={source.title} source={source} />
        ))}
      </div>
    </section>
  )
}
