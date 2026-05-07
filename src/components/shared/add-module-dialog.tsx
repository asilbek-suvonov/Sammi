import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AddModuleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (title: string) => void
}

export function AddModuleDialog({
  open,
  onOpenChange,
  onAdd,
}: AddModuleDialogProps) {
  const [title, setTitle] = useState('')

  const handleSave = () => {
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setTitle('')
    onOpenChange(false)
  }

  const handleCancel = () => {
    setTitle('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Modul qo'shish</DialogTitle>
        </DialogHeader>
        <div className='space-y-2 py-2'>
          <Label htmlFor='module-title'>Modul nomi</Label>
          <Input
            id='module-title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Masalan: 1-modul: Kirish'
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={handleCancel}>
            Bekor qilish
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Saqlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
