import { useEffect, useState, type MouseEvent } from 'react'
import { X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type ImagePreviewProps = {
  src: string
  alt?: string
  className?: string
  thumbClassName?: string
  rounded?: boolean
}

export function ImagePreview({
  src,
  alt = 'Preview',
  className,
  thumbClassName,
  rounded = true,
}: ImagePreviewProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const handleThumbClick = (e: MouseEvent) => {
    e.stopPropagation()
    setOpen(true)
  }

  if (!src) return null

  return (
    <>
      <button
        type='button'
        onClick={handleThumbClick}
        aria-label={`Preview ${alt}`}
        className={cn(
          'group relative inline-flex shrink-0 overflow-hidden ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          rounded && 'rounded-md',
          className,
        )}
      >
        <img
          src={src}
          alt={alt}
          className={cn('h-full w-full object-cover', thumbClassName)}
        />
        <span className='absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100'>
          <ZoomIn className='size-4 text-white' />
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className='max-w-3xl overflow-hidden border-0 bg-transparent p-0 shadow-none'
        >
          <DialogTitle className='sr-only'>{alt}</DialogTitle>
          <DialogDescription className='sr-only'>
            Image preview
          </DialogDescription>
          <div className='relative flex items-center justify-center'>
            <img
              src={src}
              alt={alt}
              className='max-h-[80vh] w-auto rounded-lg object-contain shadow-2xl'
            />
            <button
              type='button'
              onClick={() => setOpen(false)}
              aria-label='Close preview'
              className='absolute -right-2 -top-2 flex size-9 items-center justify-center rounded-full bg-background text-foreground shadow-lg ring-1 ring-border transition hover:bg-muted'
            >
              <X className='size-4' />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
