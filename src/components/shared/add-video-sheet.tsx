import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet';
import { useState } from 'react';

export interface VideoFormData {
  title: string
  videoUrl?: string
}

interface AddVideoSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (video: VideoFormData) => void
}

export function AddVideoSheet({
  open,
  onOpenChange,
  onAdd,
}: AddVideoSheetProps) {
  const [title, setTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  const handleSave = () => {
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd({ title: trimmed, videoUrl: videoUrl.trim() || undefined })
    setTitle('')
    setVideoUrl('')
    onOpenChange(false)
  }

  const handleCancel = () => {
    setTitle('')
    setVideoUrl('')
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Video qo'shish</SheetTitle>
        </SheetHeader>
        <div className='space-y-4 px-4 pb-6'>
          <div className='space-y-2'>
            <Label htmlFor='video-title'>Video nomi *</Label>
            <Input
              id='video-title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Masalan: Kirish darsi'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='video-url'>Video havolasi (ixtiyoriy)</Label>
            <Input
              id='video-url'
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder='https://...'
            />
          </div>
        </div>
        <div className='flex items-end justify-end gap-3 rounded-b-lg border-t border-gray-100 bg-gray-50 px-6 py-4'>
          <Button
            variant='ghost'
            onClick={handleCancel}
            className='text-gray-600 transition-colors hover:bg-gray-200'
          >
            Bekor qilish
          </Button>

          <Button
            onClick={handleSave}
            disabled={!title.trim()}
            className='px-8 shadow-sm transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Saqlash
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
