import * as React from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type FileUploadProps = {
  value: string
  onChange: (value: string) => void
  accept?: string
  placeholder?: string
  className?: string
}

export function FileUpload({
  value,
  onChange,
  accept = 'image/*',
  placeholder,
  className,
}: FileUploadProps) {
  const fileRef = React.useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = React.useState('')
  const isImage = accept.includes('image')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    if (isImage) {
      const reader = new FileReader()
      reader.onload = (ev) => onChange((ev.target?.result ?? '') as string)
      reader.readAsDataURL(file)
    } else {
      onChange(file.name)
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleClear = () => {
    onChange('')
    setFileName('')
  }

  const displayName = fileName || (value && !value.startsWith('data:') ? value : '') || (value ? 'File selected' : '')

  return (
    <div className={cn('space-y-2', className)}>
      <div
        role='button'
        tabIndex={0}
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input px-4 py-5 transition-colors hover:border-primary/60 hover:bg-muted/30',
          value && 'border-primary/40 bg-muted/20'
        )}
      >
        <Upload className='size-5 text-muted-foreground' />
        {displayName ? (
          <p className='max-w-full truncate text-sm text-foreground'>{displayName}</p>
        ) : (
          <p className='text-sm text-muted-foreground'>
            {placeholder ?? 'Click to upload'}
          </p>
        )}
        <p className='text-xs text-muted-foreground/60'>
          {accept.replace('*', '').replace('/', '').toUpperCase() || 'Any file'}
        </p>
      </div>

      <input
        ref={fileRef}
        type='file'
        accept={accept}
        onChange={handleFile}
        className='hidden'
      />

      {value && (
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={handleClear}
          className='h-8 w-full text-xs'
        >
          <X className='mr-1.5 size-3.5' />
          Remove file
        </Button>
      )}

      {isImage && value && <ImagePreview src={value} />}
    </div>
  )
}

function ImagePreview({ src }: { src: string }) {
  const [error, setError] = React.useState(false)

  React.useEffect(() => setError(false), [src])

  if (error) return null

  return (
    <div className='relative h-32 overflow-hidden rounded-md border bg-muted'>
      <img
        src={src}
        alt='Preview'
        className='h-full w-full object-cover'
        onError={() => setError(true)}
      />
    </div>
  )
}
