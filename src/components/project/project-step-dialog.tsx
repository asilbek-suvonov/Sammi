import { useRef, useState } from 'react'
import { Loader2, Upload, Video } from 'lucide-react'
import {
  useCreateProjectStep,
  useUpdateProjectStep,
} from '@/api-hooks/projects/use-projects'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { ProjectStep } from '@/service/projects/projects.type'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: number
  step?: ProjectStep
  /** Next available order (used when creating a new step) */
  nextOrder?: number
}

function formatFileName(name: string, max = 30) {
  if (name.length <= max) return name
  const dot = name.lastIndexOf('.')
  const ext = dot >= 0 ? name.slice(dot + 1) : ''
  const base = dot >= 0 ? name.slice(0, dot) : name
  return `${base.slice(0, 15)}...${base.slice(-5)}.${ext}`
}

function readVideoDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      resolve(Number.isFinite(video.duration) ? Math.round(video.duration) : null)
    }
    video.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    video.src = url
  })
}

export function ProjectStepDialog({
  open,
  onOpenChange,
  projectId,
  step,
  nextOrder = 1,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        {open && (
          <StepFormBody
            key={step?.id ?? 'new'}
            projectId={projectId}
            step={step}
            nextOrder={nextOrder}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

interface BodyProps {
  projectId: number
  step?: ProjectStep
  nextOrder: number
  onClose: () => void
}

function StepFormBody({ projectId, step, nextOrder, onClose }: BodyProps) {
  const isEdit = !!step
  const fileRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(step?.title ?? '')
  const [description, setDescription] = useState(step?.description ?? '')
  const [duration, setDuration] = useState<number>(step?.duration ?? 0)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('')

  const createStep = useCreateProjectStep()
  const updateStep = useUpdateProjectStep()
  const isPending = createStep.isPending || updateStep.isPending

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setVideoFile(file)
    setFileName(file.name)
    const detected = await readVideoDuration(file)
    if (detected != null) setDuration(detected)
    if (fileRef.current) fileRef.current.value = ''
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const trimmedDesc = description.trim()

    if (isEdit && step) {
      updateStep.mutate(
        {
          id: step.id,
          data: {
            project: projectId,
            title: title.trim(),
            description: trimmedDesc || undefined,
            video: videoFile ?? undefined,
            duration: duration > 0 ? duration : undefined,
            order: step.order,
          },
        },
        { onSuccess: onClose }
      )
      return
    }

    const createPayload: Parameters<typeof createStep.mutate>[0] = {
      project: projectId,
      title: title.trim(),
    }
    if (trimmedDesc) createPayload.description = trimmedDesc
    if (videoFile) createPayload.video = videoFile
    if (duration > 0) createPayload.duration = duration
    if (nextOrder > 0) createPayload.order = nextOrder

    createStep.mutate(createPayload, { onSuccess: onClose })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Edit step' : 'Add step'}</DialogTitle>
      </DialogHeader>

      <form onSubmit={onSubmit} className='space-y-4 pt-2'>
        <div className='space-y-2'>
          <Label htmlFor='step-title'>Title</Label>
          <Input
            id='step-title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='step-desc'>Description</Label>
          <Textarea
            id='step-desc'
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Optional'
          />
        </div>

        <div className='space-y-2'>
          <Label>
            Video{' '}
            {isEdit && (
              <span className='text-xs font-normal text-muted-foreground'>
                (upload to replace)
              </span>
            )}
          </Label>
          <div
            role='button'
            tabIndex={0}
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
            className={cn(
              'flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 transition-colors',
              fileName
                ? 'border-primary/40 bg-primary/5'
                : 'border-input hover:border-primary/60 hover:bg-muted/30'
            )}
          >
            {fileName ? (
              <Video className='size-5 text-primary' />
            ) : (
              <Upload className='size-5 text-muted-foreground' />
            )}
            <p
              title={fileName}
              className={cn(
                'text-center text-xs',
                fileName ? 'font-medium text-primary' : 'text-muted-foreground'
              )}
            >
              {fileName
                ? formatFileName(fileName)
                : 'Click to select a video file'}
            </p>
          </div>
          <input
            ref={fileRef}
            type='file'
            accept='video/*'
            className='hidden'
            onChange={onFileChange}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='step-duration'>Duration (seconds)</Label>
          <Input
            id='step-duration'
            type='number'
            min={0}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value) || 0)}
          />
        </div>

        <DialogFooter className='gap-2 sm:gap-0'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isPending || !title.trim()}>
            {isPending && <Loader2 className='mr-2 size-4 animate-spin' />}
            Save
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}
