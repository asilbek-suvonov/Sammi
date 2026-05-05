import { Main } from '@/components/layout/main'
import { useSources } from '@/api-hooks/sources/useSources'
import { SourceCard } from '@/components/cards/source-card'
import { Separator } from '@/components/ui/separator'

const UserSources = () => {
  const { data, isLoading } = useSources()
  const sources = data?.results ?? []

  return (
    <Main>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Sources</h1>
        <p className='text-sm text-muted-foreground'>
          Open-source repositories and learning resources.
        </p>
      </div>

      <Separator className='my-4' />

      {isLoading ? (
        <div className='py-12 text-center text-sm text-muted-foreground'>
          Yuklanmoqda...
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {sources.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      )}
    </Main>
  )
}

export default UserSources
