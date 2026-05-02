import { SourceCard } from '@/components/cards/source-card'
import { useSources } from '@/api-hooks'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

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
        <Card className='p-8 text-center'>
          <BookOpen className='mx-auto h-8 w-8 text-muted-foreground/50' />
          <p className='mt-2 text-sm text-muted-foreground'>{t('noSourcesAvailable')}</p>
        </Card>
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
