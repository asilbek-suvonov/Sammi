import { useState } from 'react'
import { Loader2, Plus, X } from 'lucide-react'
import { useCreateTechnology } from '@/api-hooks/technology/use-technologies'
import type {
  Technology,
  TechnologyCategory,
} from '@/service/technology/technology.types'
import { Badge } from '@/components/ui/badge'
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
  defaultCategory?: TechnologyCategory
}

export function TechQuickAdd({ onCreated, defaultCategory }: Props) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [category, setCategory] = useState<TechnologyCategory>(
    defaultCategory ?? 'frontend'
  )
  const [values, setValues] = useState<string[]>([])
  const [valueDraft, setValueDraft] = useState('')

  const createMutation = useCreateTechnology()

  const reset = () => {
    setLabel('')
    setCategory(defaultCategory ?? 'frontend')
    setValues([])
    setValueDraft('')
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    setOpen(next)
  }

  const addValue = () => {
    const trimmed = valueDraft.trim()
    if (!trimmed || values.includes(trimmed)) {
      setValueDraft('')
      return
    }
    setValues((prev) => [...prev, trimmed])
    setValueDraft('')
  }

  const removeValue = (v: string) => {
    setValues((prev) => prev.filter((x) => x !== v))
  }

  const onValueKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addValue()
    } else if (e.key === 'Backspace' && !valueDraft && values.length > 0) {
      setValues((prev) => prev.slice(0, -1))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const trimmedLabel = label.trim()
    if (!trimmedLabel) return

    const pending = valueDraft.trim()
    const finalValues = pending && !values.includes(pending) ? [...values, pending] : values
    if (finalValues.length === 0) {
      finalValues.push(trimmedLabel.toLowerCase().replace(/\s+/g, '-'))
    }

    const created = await createMutation.mutateAsync({
      label: trimmedLabel,
      value: finalValues,
      category,
    })
    onCreated(created)
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type='button'
          variant='outline'
          size='icon'
          className='size-9 shrink-0'
          aria-label='Add new technology'
        >
          <Plus className='size-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Add technology</DialogTitle>
          <DialogDescription>
            Create a new technology to reuse in courses and projects.
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
            <Label htmlFor='tech-value'>Values</Label>
            <div className='flex gap-2'>
              <Input
                id='tech-value'
                placeholder='Yozing va Enter bosing'
                value={valueDraft}
                onChange={(e) => setValueDraft(e.target.value)}
                onKeyDown={onValueKeyDown}
              />
              <Button
                type='button'
                size='icon'
                variant='outline'
                className='shrink-0'
                onClick={addValue}
                aria-label='Add value'
              >
                <Plus className='size-4' />
              </Button>
            </div>
            {values.length > 0 && (
              <div className='flex flex-wrap gap-1.5 pt-1'>
                {values.map((v) => (
                  <Badge key={v} variant='secondary' className='gap-1 pe-1'>
                    {v}
                    <button
                      type='button'
                      onClick={() => removeValue(v)}
                      className='rounded-sm hover:bg-background/40'
                      aria-label={`Remove ${v}`}
                    >
                      <X className='size-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className='text-[11px] text-muted-foreground'>
              Each entry is appended to the technology&apos;s value array.
            </p>
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
