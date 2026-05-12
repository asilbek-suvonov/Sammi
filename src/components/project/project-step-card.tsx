import { ArrowDown, ArrowUp, Clock3, Loader2, Pencil, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import type { ProjectStep } from '@/service/projects/projects.type'

interface Props {
  step: ProjectStep
  index: number
  canMoveUp: boolean
  canMoveDown: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onEdit: () => void
  onDelete: () => void
  isDeleting: boolean
  isReordering: boolean
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function ProjectStepCard({
  step,
  index,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
  isDeleting,
  isReordering,
}: Props) {
  return (
    <div className='flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/10'>
      <span className='mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary'>
        {index + 1}
      </span>

      <div className='min-w-0 flex-1 space-y-1'>
        <h3 className='truncate text-sm font-semibold'>{step.title}</h3>
        {step.description && (
          <p className='line-clamp-2 text-xs text-muted-foreground'>
            {step.description}
          </p>
        )}
        <div className='flex items-center gap-1.5 text-[11px] text-muted-foreground'>
          <Clock3 className='size-3' />
          {formatDuration(step.duration)}
        </div>
      </div>

      <div className='flex shrink-0 items-center gap-1'>
        <Button
          size='icon'
          variant='ghost'
          className='size-8'
          onClick={onMoveUp}
          disabled={!canMoveUp || isReordering}
          aria-label='Move up'
        >
          <ArrowUp className='size-4' />
        </Button>
        <Button
          size='icon'
          variant='ghost'
          className='size-8'
          onClick={onMoveDown}
          disabled={!canMoveDown || isReordering}
          aria-label='Move down'
        >
          <ArrowDown className='size-4' />
        </Button>
        <Button
          size='icon'
          variant='ghost'
          className='size-8'
          onClick={onEdit}
          aria-label='Edit step'
        >
          <Pencil className='size-4' />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size='icon'
              variant='ghost'
              className='size-8 text-muted-foreground hover:text-destructive'
              disabled={isDeleting}
              aria-label='Delete step'
            >
              {isDeleting ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <Trash2 className='size-4' />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this step?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The step and its uploaded video
                will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                onClick={onDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
