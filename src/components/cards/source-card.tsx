import { IconGithub } from '@/assets/brand-icons'
import { Card } from '@/components/ui/card'
import type { Source } from '@/data/mock-data'
import { ExternalLink, FolderGit2 } from 'lucide-react'

export function SourceCard({ source }: { source: Source }) {
  return (
    <a
      href={source.href}
      target='_blank'
      rel='noreferrer'
      className='group block'
    >
      <Card className='relative overflow-hidden border bg-card p-4 transition-all duration-300 hover:border-primary/10 hover:shadow-md'>
        
        <div className='absolute left-0 top-0 h-full w-[2px] bg-primary opacity-0 transition-all duration-300 group-hover:opacity-100' />

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            
            <div className='flex h-11 w-11 items-center justify-center rounded-xl border bg-muted/50 transition-colors group-hover:bg-primary/10'>
              <FolderGit2 className='size-5 text-muted-foreground transition-colors group-hover:text-primary' />
            </div>

            <div className='space-y-0.5'>
              <h3 className='text-sm font-semibold tracking-tight transition-colors group-hover:text-primary'>
                {source.title}
              </h3>
              <p className='text-[10px] uppercase tracking-wider text-muted-foreground'>
                Repository
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <div className='flex h-9 w-9 items-center justify-center rounded-full border bg-muted/50'>
              <IconGithub className='size-4 text-muted-foreground' />
            </div>

            <ExternalLink className='size-4 text-muted-foreground transition-colors group-hover:text-primary' />
          </div>
        </div>
      </Card>
    </a>
  )
}