import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import {
  useDeleteProjectStep,
  useProjectSteps,
  useReorderProjectSteps,
} from '@/api-hooks/projects/use-projects'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { ProjectStep } from '@/service/projects/projects.type'
import { ProjectStepCard } from './project-step-card'
import { ProjectStepDialog } from './project-step-dialog'

interface Props {
  projectId: number
}

export function ProjectStepsSection({ projectId }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingStep, setEditingStep] = useState<ProjectStep | undefined>()

  // ✅ Ichkaridan fetch qilamiz
  const { data, isLoading } = useProjectSteps(projectId)
  const steps: ProjectStep[] = data?.results ?? []

  const deleteStep = useDeleteProjectStep()
  const reorderSteps = useReorderProjectSteps(projectId)

  const sorted = useMemo(
    () => [...steps].sort((a, b) => a.order - b.order),
    [steps],
  )

  const nextOrder = sorted.length
    ? Math.max(...sorted.map((s) => s.order)) + 1
    : 1

  const openAdd = () => {
    setEditingStep(undefined)
    setDialogOpen(true)
  }

  const openEdit = (step: ProjectStep) => {
    setEditingStep(step)
    setDialogOpen(true)
  }

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= sorted.length) return
    const next = sorted.map((s) => ({ ...s }))
    ;[next[index], next[target]] = [next[target], next[index]]
    reorderSteps.mutate({
      project: projectId,
      steps: next.map((s, i) => ({ id: s.id, order: i + 1 })),
    })
  }

  if (isLoading) {
    return (
      <div className='mt-6 space-y-3'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-20 w-full' />
        <Skeleton className='h-20 w-full' />
      </div>
    )
  }

  return (
    <div className='mt-6'>
      <div className='mb-4 flex items-end justify-between border-b pb-3'>
        <div>
          <h2 className='text-xl font-bold tracking-tight'>Project steps</h2>
          <p className='text-sm text-muted-foreground'>
            {sorted.length} step{sorted.length === 1 ? '' : 's'} total
          </p>
        </div>
        <Button size='sm' onClick={openAdd}>
          <Plus className='mr-2 size-4' />
          Add step
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center'>
          <p className='text-sm text-muted-foreground'>No steps yet.</p>
          <Button size='sm' variant='outline' className='mt-3' onClick={openAdd}>
            <Plus className='mr-2 size-4' />
            Add the first step
          </Button>
        </div>
      ) : (
        <div className='space-y-3'>
          {sorted.map((step, i) => (
            <ProjectStepCard
              key={step.id}
              step={step}
              index={i}
              canMoveUp={i > 0}
              canMoveDown={i < sorted.length - 1}
              onMoveUp={() => move(i, -1)}
              onMoveDown={() => move(i, 1)}
              onEdit={() => openEdit(step)}
              onDelete={() =>
                // ✅ projectPk kerak, project emas
                deleteStep.mutate({ projectPk: projectId, id: step.id })
              }
              isDeleting={
                deleteStep.isPending && deleteStep.variables?.id === step.id
              }
              isReordering={reorderSteps.isPending}
            />
          ))}
        </div>
      )}

      <ProjectStepDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingStep(undefined)
        }}
        projectId={projectId}
        step={editingStep}
        nextOrder={nextOrder}
      />
    </div>
  )
}
