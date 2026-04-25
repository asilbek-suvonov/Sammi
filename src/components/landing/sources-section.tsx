import { SourceCard } from '@/components/cards/source-card'
import { useAdminStore } from '@/stores/admin-store'
import { useTranslation } from 'react-i18next'

export function SourcesSection() {
  const { t } = useTranslation()
  const { sources } = useAdminStore()

  return (
    <section id='sources' className='space-y-6'>
      <div className='space-y-0.5'>
        <h2 className='text-xl font-semibold tracking-tight'>{t('sourcesTitle')}</h2>
        <p className='text-sm text-muted-foreground'>{t('sourcesSubtitle')}</p>
      </div>
      <div className='grid gap-4 md:grid-cols-3'>
        {sources.map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>
    </section>
  )
}
