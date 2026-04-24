import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { type Course } from '@/data/mock-data'
import { useAdminStore } from '@/stores/admin-store'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().min(1, 'Image URL is required'),
  preview_video_url: z.string(),
  category: z.string(),
  technologies: z.string(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  price: z.string().min(1, 'Price is required'),
  is_free: z.boolean(),
  is_new: z.boolean(),
  is_published: z.boolean(),
})

type CourseFormValues = z.infer<typeof courseSchema>

const defaultValues: CourseFormValues = {
  title: '',
  description: '',
  image: '',
  preview_video_url: '',
  category: '',
  technologies: '',
  level: 'Beginner',
  price: '',
  is_free: false,
  is_new: false,
  is_published: false,
}

type CourseSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  course?: Course | null
}

export function CourseSheet({ open, onOpenChange, course }: CourseSheetProps) {
  const { addCourse, updateCourse } = useAdminStore()
  const isEdit = !!course

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      if (course) {
        form.reset({
          title: course.title,
          description: course.description,
          image: course.image,
          preview_video_url: course.preview_video_url ?? '',
          category: course.category ?? '',
          technologies: course.technologies?.join(', ') ?? '',
          level: course.level,
          price: course.price,
          is_free: course.is_free ?? false,
          is_new: course.is_new ?? false,
          is_published: course.is_published ?? false,
        })
      } else {
        form.reset(defaultValues)
      }
    }
  }, [open, course, form])

  const onSubmit = (values: CourseFormValues) => {
    const technologies = values.technologies
      ? values.technologies.split(',').map((t) => t.trim()).filter(Boolean)
      : []

    if (isEdit && course) {
      updateCourse(course.id, {
        title: values.title,
        description: values.description,
        image: values.image,
        preview_video_url: values.preview_video_url || undefined,
        category: values.category || undefined,
        technologies,
        level: values.level,
        price: values.price,
        is_free: values.is_free,
        is_new: values.is_new,
        is_published: values.is_published,
      })
      toast.success('Course updated successfully')
    } else {
      addCourse({
        id: String(Date.now()),
        title: values.title,
        description: values.description,
        image: values.image,
        preview_video_url: values.preview_video_url || undefined,
        category: values.category || undefined,
        technologies,
        level: values.level,
        price: values.price,
        is_free: values.is_free,
        is_new: values.is_new,
        is_published: values.is_published,
        parts: 0,
        hours: 0,
        students: 0,
        rating: 0,
        instructor: 'Admin',
        modules: [],
      })
      toast.success('Course added successfully')
    }
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col gap-0 p-0 sm:max-w-lg'>
        <SheetHeader className='px-6 pt-6 pb-4'>
          <SheetTitle>{isEdit ? 'Edit Course' : 'Add New Course'}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? 'Update the course details below.'
              : 'Fill in the details to add a new course.'}
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <ScrollArea className='flex-1'>
          <Form {...form}>
            <form
              id='course-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-6 py-4'
            >
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder='React Mastery Course' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Course description...'
                        rows={3}
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='image'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder='https://...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='preview_video_url'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preview Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder='https://youtube.com/...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='category'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder='Frontend, Backend...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='level'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select level' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='Beginner'>Beginner</SelectItem>
                          <SelectItem value='Intermediate'>Intermediate</SelectItem>
                          <SelectItem value='Advanced'>Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='technologies'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technologies</FormLabel>
                    <FormControl>
                      <Input placeholder='React, TypeScript, Tailwind (comma-separated)' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder='$99' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='is_free'
                  render={({ field }) => (
                    <FormItem className='flex flex-col gap-2 rounded-lg border p-3'>
                      <FormLabel className='text-sm'>Free</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='is_new'
                  render={({ field }) => (
                    <FormItem className='flex flex-col gap-2 rounded-lg border p-3'>
                      <FormLabel className='text-sm'>New</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='is_published'
                  render={({ field }) => (
                    <FormItem className='flex flex-col gap-2 rounded-lg border p-3'>
                      <FormLabel className='text-sm'>Published</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </ScrollArea>
        <Separator />
        <SheetFooter className='flex flex-row justify-end gap-2 px-6 py-4'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type='submit' form='course-form'>
            {isEdit ? 'Update Course' : 'Add Course'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
