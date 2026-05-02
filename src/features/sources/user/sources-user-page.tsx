import { useState } from 'react'
import { Github, ExternalLink, Search, BookOpen, Calendar } from 'lucide-react'
import { useSources } from '@/api-hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export function SourcesUserPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useSources({
    page,
    search: search || undefined,
  })

  return (
    <div className='space-y-6 p-6 max-w-6xl mx-auto'>
      {/* Header */}
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Source Codes</h1>
        <p className='text-muted-foreground'>
          Access GitHub repositories and example projects for your learning
        </p>
      </div>

      {/* Search */}
      <div className='flex gap-2'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search source codes...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className='pl-9'
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className='border-destructive'>
          <CardHeader>
            <CardTitle className='text-destructive'>Error loading sources</CardTitle>
            <CardDescription>{error.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} variant='outline'>
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-5 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
              </CardHeader>
              <CardContent className='space-y-3'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-9 w-full' />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && data?.results.length === 0 && (
        <Card className='text-center py-12'>
          <CardContent>
            <BookOpen className='mx-auto h-12 w-12 text-muted-foreground/50' />
            <h3 className='mt-4 text-lg font-semibold'>No source codes found</h3>
            <p className='text-muted-foreground'>
              {search ? 'Try different search terms' : 'Check back later for new resources'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Sources Grid */}
      {!isLoading && !error && data?.results && (
        <>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {data.results.map((source) => (
              <Card key={source.id} className='flex flex-col'>
                <CardHeader>
                  <div className='flex items-start justify-between gap-2'>
                    <CardTitle className='text-lg line-clamp-2'>{source.title}</CardTitle>
                    {source.is_published && <Badge>Published</Badge>}
                  </div>
                  <CardDescription className='flex items-center gap-1'>
                    <Calendar className='h-3 w-3' />
                    {new Date(source.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex-1 flex flex-col gap-4'>
                  <p className='text-sm text-muted-foreground line-clamp-2'>
                    Access the full source code on GitHub to study and practice.
                  </p>
                  <Button asChild className='w-full mt-auto'>
                    <a
                      href={source.github_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center justify-center gap-2'
                    >
                      <Github className='h-4 w-4' />
                      View on GitHub
                      <ExternalLink className='h-3 w-3' />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {data.count > 10 && (
            <div className='flex items-center justify-center gap-2 pt-4'>
              <Button
                variant='outline'
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data.previous}
              >
                Previous
              </Button>
              <span className='text-sm text-muted-foreground px-4'>
                Page {page} of {Math.ceil(data.count / 10)}
              </span>
              <Button
                variant='outline'
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.next}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SourcesUserPage
