import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { ZoomIn } from 'lucide-react'
import { useEffect, useState, type MouseEvent } from 'react'

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
          onPointerDownOutside={(e) => {
            // Prevent Radix from closing on pointerdown so the overlay stays in DOM
            // long enough for the subsequent click event to fire on the overlay
            // (not on the underlying table row), avoiding unintended row navigation.
            e.preventDefault()
            setOpen(false)
          }}
        >
          <DialogTitle className='sr-only'>{alt}</DialogTitle>
          <DialogDescription className='sr-only'>
            Image preview
          </DialogDescription>
          <div>
            <img
              src={src}
              alt={alt}
              className='max-h-[80vh] w-auto rounded-lg object-contain shadow-2xl'
            />
           
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
