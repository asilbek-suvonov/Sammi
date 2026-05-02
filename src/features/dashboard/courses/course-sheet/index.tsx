import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { type Course } from '@/data/mock-data'
import { useCourseActions } from '@/stores/selectors'
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

function createCourseId() {
  return String(Date.now())
}

type CourseSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  course?: Course | null
}

export function CourseSheet({ open, onOpenChange, course }: CourseSheetProps) {
  const { addCourse, updateCourse } = useCourseActions()
  const isEdit = !!course

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: courseDefaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(course ? courseToFormValues(course) : courseDefaultValues)
    }
  }, [open, course, form])

  const onSubmit = (values: CourseFormValues) => {
    if (isEdit && course) {
      updateCourse(course.id, {
        ...course,
        ...values,
      })
      toast.success('Course updated successfully')
    } else {
      addCourse({
        id: createCourseId(),
        ...values,
        parts: 0,
        hours: 0,
        students: 0,
        rating: 0,
        instructor: 'Admin',
        modules: [],
        language: 'uz',
      })
      toast.success('Course added successfully')
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
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type='submit' form='course-form'>
            Save Course
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
