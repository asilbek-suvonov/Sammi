import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { type Lesson } from '@/data/mock-data'
import { useCourseActions } from '@/stores/selectors'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const videoSchema = z.object({
  title: z.string().min(1, 'Video title is required'),
  videoUrl: z.string().min(1, 'Video file is required'),
})

type VideoFormValues = z.infer<typeof videoSchema>

const defaultValues: VideoFormValues = {
  title: '',
  videoUrl: '',
}

type VideoSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: string
  moduleId: string
  lesson?: Lesson | null
}

export function VideoSheet({
  open,
  onOpenChange,
  courseId,
  moduleId,
  lesson,
}: VideoSheetProps) {
  const { addLesson, updateLesson } = useCourseActions()
  const isEdit = !!lesson

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      if (lesson) {
        form.reset({
          title: lesson.title,
          videoUrl: lesson.videoUrl ?? '',
        })
      } else {
        form.reset(defaultValues)
      }
    }
  }, [open, lesson, form])

  const onSubmit = (values: VideoFormValues) => {
    if (isEdit && lesson) {
      updateLesson(courseId, moduleId, lesson.id, {
        title: values.title,
        videoUrl: values.videoUrl,
      })
      toast.success('Video updated')
    } else {
      addLesson(courseId, moduleId, {
        id: `v_${Date.now()}`,
        title: values.title,
        duration: '',
        videoUrl: values.videoUrl,
      })
      toast.success('Video added')
    }
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex h-full flex-col gap-0 p-0 sm:max-w-[450px]'>
        <SheetHeader className='px-6 pt-2 pb-2'>
          <SheetTitle>{isEdit ? 'Edit video' : 'Add video'}</SheetTitle>
          <SheetDescription className='text-xs'>
            Provide a title and upload the video file.
          </SheetDescription>
        </SheetHeader>
        <Separator />

        <div className='flex-1 overflow-y-auto px-6 py-4'>
          <Form {...form}>
            <form
              id='video-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Lesson 1 — Setup'
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='videoUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        accept='video/*'
                        placeholder='Upload video file'
                        hideExistingValue={isEdit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <Separator />
        <SheetFooter className='flex flex-row justify-end gap-2 px-6 py-4'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type='submit' form='video-form'>
            {isEdit ? 'Save changes' : 'Add video'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
