import { useSources } from '@/api-hooks';
import { SourceCard } from '@/components/cards/source-card';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

export function SourcesSection() {
  const { t } = useTranslation()
  const { data, isLoading } = useSources({ page: 1 })

  const sources = data?.results || []

  return (
    <section id='sources' className='space-y-6'>
      <div className='space-y-0.5'>
        <h2 className='text-xl font-semibold tracking-tight'>{t('sourcesTitle')}</h2>
        <p className='text-sm text-muted-foreground'>{t('sourcesSubtitle')}</p>
      </div>

      {isLoading ? (
        <div className='grid gap-4 md:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className='p-4'>
              <Skeleton className='h-16 w-full' />
            </Card>
          ))}
        </div>
      ) : sources.length === 0 ? (
        <div className='p-8 text-center'>
          <p className='mt-2 text-sm text-muted-foreground'>{t('noSourcesAvailable')}</p>
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-3'>
          {sources.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      )}
    </section>
  )
}
