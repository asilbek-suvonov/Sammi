import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { Lesson } from '../service/lessons/lessons.types'

interface LessonFormProps {
  initialData?: Lesson
  isPending: boolean
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export function LessonForm({ initialData, isPending, onSubmit, onCancel }: LessonFormProps) {
  return (
    <form onSubmit={onSubmit} className="p-4 border-2 border-dashed rounded-lg bg-background space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs">Dars nomi</Label>
          <Input name="title" required placeholder="Dars nomini kiriting" defaultValue={initialData?.title} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Video URL</Label>
          <Input name="video_url" required placeholder="https://..." defaultValue={initialData?.video_url} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Davomiyligi (minut)</Label>
          <Input name="duration" type="number" defaultValue={initialData?.duration || 0} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Tartib raqami</Label>
          <Input name="order" type="number" defaultValue={initialData?.order || 1} />
        </div>
      </div>
      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_preview" id="is_preview" defaultChecked={initialData?.is_preview} />
          <Label htmlFor="is_preview" className="text-xs italic">Bepul ko'rishga ruxsat berish</Label>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Bekor qilish</Button>
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 size-3 animate-spin" />}
            Saqlash
          </Button>
        </div>
      </div>
    </form>
  )
}