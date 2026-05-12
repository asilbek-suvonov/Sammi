import { useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { useCreateTechnology } from '@/api-hooks/technology/use-technologies'
import type {
  Technology,
  TechnologyCategory,
} from '@/service/technology/technology.types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CATEGORIES: { value: TechnologyCategory; label: string }[] = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'devops', label: 'DevOps' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'other', label: 'Other' },
]

interface Props {
  onCreated: (tech: Technology) => void
}

export function TechQuickAdd({ onCreated }: Props) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [category, setCategory] = useState<TechnologyCategory>('frontend')

  const createMutation = useCreateTechnology()

  const reset = () => {
    setLabel('')
    setCategory('frontend')
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    setOpen(next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = label.trim()
    if (!trimmed) return
    const created = await createMutation.mutateAsync({
      label: trimmed,
      value: [trimmed.toLowerCase().replace(/\s+/g, '-')],
      category,
    })
    onCreated(created)
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type='button' variant='outline' size='sm' className='gap-1'>
          <Plus className='size-3.5' />
          New
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Add technology</DialogTitle>
          <DialogDescription>
            Create a new technology to use in courses and projects.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='tech-label'>Name</Label>
            <Input
              id='tech-label'
              autoFocus
              placeholder='e.g. Next.js'
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as TechnologyCategory)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className='gap-2 sm:gap-0'>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={!label.trim() || createMutation.isPending}
            >
              {createMutation.isPending && (
                <Loader2 className='mr-2 size-4 animate-spin' />
              )}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
