import { useState } from 'react'
import { ChevronDown, PlayCircle, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface ModuleVideo {
  id: number
  title: string
  videoUrl?: string
}

export interface Module {
  id: number
  title: string
  videos: ModuleVideo[]
}

interface ModuleCardProps {
  order: number
  module: Module
  onAddVideo: () => void
}

export function ModuleCard({ order, module, onAddVideo }: ModuleCardProps) {
  const [open, setOpen] = useState(true)

  return (
    <Card>
      <CardHeader
        className='cursor-pointer select-none'
        onClick={() => setOpen((v) => !v)}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <span className='flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary'>
              {order}
            </span>
            <CardTitle className='text-base'>{module.title}</CardTitle>
          </div>
          <ChevronDown
            className={cn(
              'size-4 text-muted-foreground transition-transform duration-200',
              open && 'rotate-180',
            )}
          />
        </div>
      </CardHeader>

      {open && (
        <CardContent className='pt-0'>
          {module.videos.length > 0 ? (
            <ul className='mb-3 space-y-1'>
              {module.videos.map((video) => (
                <li
                  key={video.id}
                  className='flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50'
                >
                  <PlayCircle className='size-4 shrink-0 text-muted-foreground' />
                  <span className='truncate'>{video.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className='mb-3 text-sm text-muted-foreground'>
              Hali video qo'shilmagan.
            </p>
          )}
          <Button
            variant='outline'
            size='sm'
            className='w-full'
            onClick={(e) => {
              e.stopPropagation()
              onAddVideo()
            }}
          >
            <Plus className='mr-2 size-4' />
            Video qo'shish
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
