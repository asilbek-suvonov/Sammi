import { Card } from '@/components/ui/card'
import type { SourceCode } from '@/service/sources/sources.type'
import { ExternalLink, FolderGit2 } from 'lucide-react'

export function SourceCard({ source }: { source: SourceCode }) {
  return (
    <a
      href={source.github_url}
      target='_blank'
      rel='noreferrer'
      className='group block'
    >
      {/* Sening dizayning: bg-background va hover effekti */}
      <Card className='relative overflow-hidden border  p-4 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/20'>

        {/* LEFT HOVER LINE - Sening g'oyang */}
        <div className='absolute left-0 top-0 h-full w-[2px] bg-foreground opacity-0 transition-all duration-300 group-hover:opacity-100' />

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            
            <div className='flex h-11 w-11 items-center justify-center rounded-xl border bg-neutral-200 transition-colors group-hover:bg-foreground/10'>
              <FolderGit2 className='size-5 text-neutral-600 transition-colors group-hover:text-foreground' />
            </div>

            <div className='space-y-0.5'>
              <h3 className='text-sm font-semibold tracking-tight transition-colors group-hover:text-foreground text-foreground'>
                {source.title}
              </h3>
              <p className='text-[10px] uppercase tracking-wider text-neutral-500'>
                Repository
              </p>
            </div>
          </div>

          <ExternalLink className='size-4 text-neutral-500 transition-colors group-hover:text-foreground' />
        </div>
      </Card>
    </a>
  )
}