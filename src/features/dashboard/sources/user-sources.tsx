import { Main } from '@/components/layout/main'
import { SourceCard } from '@/components/cards/source-card'
import { Separator } from '@/components/ui/separator'
import { useSources } from '@/stores/selectors'

const UserSources = () => {
  const sources = useSources()

  return (
    <>
      <Main>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Sources</h1>
          <p className='text-sm text-muted-foreground'>
            Open-source repositories and learning resources.
          </p>
        </div>

        <Separator className='my-4' />

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {sources.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      </Main>
    </>
  )
}

export default UserSources
