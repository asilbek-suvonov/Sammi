import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Source } from '@/data/mock-data'
import { ExternalLink, FolderGit2, GitCommit, Star } from 'lucide-react'

export function SourceCard({ source }: { source: Source }) {
  return (
    <Card className='transition-shadow duration-200 hover:shadow-md'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-2 text-[14px] font-medium'>
          <FolderGit2 className='size-4 text-muted-foreground' />
          {source.title}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <p className='text-sm text-muted-foreground'>{source.description}</p>
        <div className='flex items-center justify-between border-t pt-3'>
          <span className='flex items-center gap-1 text-xs text-muted-foreground'>
            <Star className='size-3 fill-amber-400 text-amber-400' /> {source.stars}
          </span>
          <a
            href={source.href}
            target='_blank'
            rel='noreferrer'
            className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground'
            onClick={(e) => e.stopPropagation()}
          >
            <GitCommit className='size-3.5' /> GitHub <ExternalLink className='size-3' />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
