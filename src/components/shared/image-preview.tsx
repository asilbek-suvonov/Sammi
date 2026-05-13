import { useState } from 'react'
import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Props = {
  src: string | null | undefined
  alt: string
  className?: string
}

export function ImagePreview({ src, alt, className }: Props) {
  const [open, setOpen] = useState(false)

  if (!src) {
    return (
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-md border bg-muted text-muted-foreground',
          className
        )}
        aria-label='No image'
      >
        <ImageIcon className='h-4 w-4' />
      </div>
    )
  }

  return (
    <>
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        className={cn(
          'group relative h-12 w-12 overflow-hidden rounded-md border bg-muted ring-offset-background transition-transform duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          className
        )}
        aria-label={`Preview ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          loading='lazy'
          className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
        />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          className='max-w-3xl gap-3 overflow-hidden p-3 sm:max-w-3xl'
        >
          <DialogHeader className='px-1'>
            <DialogTitle className='truncate text-sm font-medium'>
              {alt}
            </DialogTitle>
          </DialogHeader>
          <div className='flex max-h-[75vh] items-center justify-center overflow-hidden rounded-md bg-muted'>
            <img
              src={src}
              alt={alt}
              className='max-h-[75vh] w-auto max-w-full object-contain'
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
