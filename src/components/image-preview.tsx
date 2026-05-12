import { useEffect, useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  const stop = (e: MouseEvent) => {
    e.stopPropagation()
  }

  const handleThumbClick = (e: MouseEvent) => {
    e.stopPropagation()
    setOpen(true)
  }

  const handleClose = (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setOpen(false)
  }

  if (!src) return null

  return (
    <>
      <button
        type='button'
        onClick={handleThumbClick}
        onPointerDown={stop}
        onMouseDown={stop}
        aria-label={`Preview ${alt}`}
        className={cn(
          'group relative inline-flex shrink-0 overflow-hidden ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          rounded && 'rounded-md',
          className
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

      {open &&
        createPortal(
          <div
            role='dialog'
            aria-modal='true'
            aria-label={alt}
            className='fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm'
            onClick={handleClose}
            onPointerDown={stop}
            onMouseDown={stop}
          >
            <img
              src={src}
              alt={alt}
              onClick={stop}
              onPointerDown={stop}
              onMouseDown={stop}
              className='max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl'
            />
            <button
              type='button'
              onClick={handleClose}
              onPointerDown={stop}
              onMouseDown={stop}
              aria-label='Close preview'
              className='absolute end-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20'
            >
              <X className='size-5' />
            </button>
          </div>,
          document.body
        )}
    </>
  )
}
