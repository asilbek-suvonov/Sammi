import * as React from 'react'
import { Link2, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type FileUploadProps = {
  value: string
  onChange: (value: string) => void
  accept?: string
  placeholder?: string
  /** 'both' shows URL + Upload tabs, 'url' shows only URL input, 'file' shows only file picker */
  mode?: 'both' | 'url' | 'file'
  className?: string
}

export function FileUpload({
  value,
  onChange,
  accept = 'image/*',
  placeholder = 'https://',
  mode = 'both',
  className,
}: FileUploadProps) {
  const fileRef = React.useRef<HTMLInputElement>(null)
  const [tab, setTab] = React.useState<'url' | 'file'>('url')
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

  if (mode === 'url') {
    return (
      <div className={cn('space-y-2', className)}>
        <div className='flex gap-2'>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
          {value && (
            <Button type='button' variant='outline' size='icon' onClick={handleClear}>
              <X className='size-4' />
            </Button>
          )}
        </div>
        {isImage && value && <ImagePreview src={value} />}
      </div>
    )
  }

  if (mode === 'file') {
    return (
      <div className={cn('space-y-2', className)}>
        <div className='flex gap-2'>
          <div className='flex-1 flex items-center rounded-md border border-input bg-transparent px-3 py-1.5 text-sm text-muted-foreground min-h-9 truncate'>
            {fileName || value || 'No file selected'}
          </div>
          <Button
            type='button'
            variant='outline'
            size='icon'
            onClick={() => fileRef.current?.click()}
          >
            <Upload className='size-4' />
          </Button>
          {(fileName || value) && (
            <Button type='button' variant='outline' size='icon' onClick={handleClear}>
              <X className='size-4' />
            </Button>
          )}
        </div>
        <input ref={fileRef} type='file' accept={accept} onChange={handleFile} className='hidden' />
        {isImage && value && <ImagePreview src={value} />}
      </div>
    )
  }

  // mode === 'both'
  const isDataUrl = value.startsWith('data:')

  return (
    <div className={cn('space-y-2', className)}>
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'url' | 'file')}>
        <TabsList className='h-8'>
          <TabsTrigger value='url' className='h-6 gap-1 px-2 text-xs'>
            <Link2 className='size-3' />
            URL
          </TabsTrigger>
          <TabsTrigger value='file' className='h-6 gap-1 px-2 text-xs'>
            <Upload className='size-3' />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value='url' className='mt-2'>
          <div className='flex gap-2'>
            <Input
              value={isDataUrl ? '' : value}
              onChange={(e) => {
                onChange(e.target.value)
                setFileName('')
              }}
              placeholder={placeholder}
            />
            {value && !isDataUrl && (
              <Button type='button' variant='outline' size='icon' onClick={handleClear}>
                <X className='size-4' />
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value='file' className='mt-2'>
          <div className='flex gap-2'>
            <div className='flex-1 flex items-center rounded-md border border-input bg-transparent px-3 py-1.5 text-sm text-muted-foreground min-h-9 truncate'>
              {fileName || (isDataUrl ? 'File selected' : 'No file selected')}
            </div>
            <Button
              type='button'
              variant='outline'
              size='icon'
              onClick={() => fileRef.current?.click()}
            >
              <Upload className='size-4' />
            </Button>
            {(fileName || value) && (
              <Button type='button' variant='outline' size='icon' onClick={handleClear}>
                <X className='size-4' />
              </Button>
            )}
          </div>
          <input
            ref={fileRef}
            type='file'
            accept={accept}
            onChange={handleFile}
            className='hidden'
          />
        </TabsContent>
      </Tabs>

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
