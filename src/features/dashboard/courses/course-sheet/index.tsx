import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  useCreateCourse,
  useUpdateCourse,
} from '@/api-hooks/course/use-courses'
import type { Course, CourseRequest } from '@/service/course/course.types'
import { dataUrlToFile } from '@/lib/data-url'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { CourseFormFields } from './course-form-fields'
import {
  courseDefaultValues,
  courseSchema,
  courseToFormValues,
  type CourseFormValues,
} from './course-schema'

type CourseSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  course?: Course | null
}

export function CourseSheet({ open, onOpenChange, course }: CourseSheetProps) {
  const isEdit = !!course
  const createMutation = useCreateCourse()
  const updateMutation = useUpdateCourse()
  const submitting = createMutation.isPending || updateMutation.isPending

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: courseDefaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(course ? courseToFormValues(course) : courseDefaultValues)
    }
  }, [open, course, form])

  const onSubmit = async (values: CourseFormValues) => {
    const image = await dataUrlToFile(values.image, 'course-image')
    const payload: CourseRequest = {
      title: values.title,
      description: values.description,
      level: values.level,
      price: values.price,
      category: values.category || undefined,
      technologies: values.technologies,
      is_free: values.is_free,
      is_new: values.is_new,
      is_published: values.is_published,
      image: image instanceof File ? image : undefined,
    }

    if (isEdit && course) {
      await updateMutation.mutateAsync({ id: course.id, data: payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex h-full flex-col gap-0 p-0 sm:max-w-[450px]'>
        <SheetHeader className='px-6 pt-2 pb-2'>
          <SheetTitle>Course details</SheetTitle>
          <SheetDescription className='text-xs'>
            Fill in the details to save the course.
          </SheetDescription>
        </SheetHeader>
        <Separator />

        <ScrollArea className='relative w-full flex-1 overflow-hidden'>
          <Form {...form}>
            <form
              id='course-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6 px-6 py-4'
            >
              <CourseFormFields control={form.control} isEdit={isEdit} />
            </form>
          </Form>
        </ScrollArea>

        <Separator />
        <SheetFooter className='flex flex-row justify-end gap-2 px-6 py-4'>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button type='submit' form='course-form' disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Course'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
