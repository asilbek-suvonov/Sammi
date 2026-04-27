import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Course } from '@/data/mock-data'
import { toast } from 'sonner'
import { useAdminStore } from '@/stores/admin-store'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
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
import { MultiSelect } from '@/components/ui/multi-select'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const TECHNOLOGIES_OPTIONS = [
  'React',
  'Vue',
  'Angular',
  'Next.js',
  'Nuxt.js',
  'Svelte',
  'TypeScript',
  'JavaScript',
  'HTML',
  'CSS',
  'Tailwind CSS',
  'SCSS',
  'Node.js',
  'Express',
  'NestJS',
  'Fastify',
  'Hono',
  'Python',
  'Django',
  'FastAPI',
  'Flask',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'SQLite',
  'GraphQL',
  'REST API',
  'WebSocket',
  'tRPC',
  'Docker',
  'Kubernetes',
  'AWS',
  'Firebase',
  'Supabase',
  'Prisma',
  'Drizzle',
  'TypeORM',
  'Zustand',
  'Redux',
  'Jotai',
  'MobX',
  'Vite',
  'Webpack',
  'Git',
  'Linux',
].map((t) => ({ label: t, value: t }))

const CATEGORY_OPTIONS = [
  'Frontend',
  'Backend',
  'Full-Stack',
  'Mobile',
  'DevOps',
  'Data Science',
  'UI/UX Design',
  'API',
  'Database',
  'Cloud',
  'Language',
  'Design',
].map((category) => ({ label: category, value: category }))

const CATEGORY_ALIASES: Record<string, string> = {
  fullstack: 'Full-Stack',
  'full-stack': 'Full-Stack',
  'full stack': 'Full-Stack',
  uiux: 'UI/UX Design',
  'ui-ux': 'UI/UX Design',
  'ui/ux': 'UI/UX Design',
  'ui/ux design': 'UI/UX Design',
}

function normalizeCategory(category?: string) {
  if (!category) return ''

  const normalized = category.trim().toLowerCase()
  const option = CATEGORY_OPTIONS.find(
    (item) => item.value.toLowerCase() === normalized
  )

  return option?.value ?? CATEGORY_ALIASES[normalized] ?? category
}

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().min(1, 'Image is required'),
  category: z.string(),
  technologies: z.array(z.string()),
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
  category: '',
  technologies: [],
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
          category: normalizeCategory(course.category),
          technologies: course.technologies ?? [],
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
    if (isEdit && course) {
      updateCourse(course.id, {
        ...course, // Keep original extra fields
        ...values,
      })
      toast.success('Course updated successfully')
    } else {
      addCourse({
        id: String(Date.now()),
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

        {/* Scrollable Area */}
        <ScrollArea className='relative w-full flex-1 overflow-hidden'>
          <Form {...form}>
            <form
              id='course-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6 px-6 py-4'
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
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        accept='image/*'
                        placeholder='Upload course image'
                        hideExistingValue={isEdit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex flex-row gap-4'>
                <FormField
                  control={form.control}
                  name='category'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Combobox
                          value={field.value}
                          onChange={field.onChange}
                          options={CATEGORY_OPTIONS}
                          placeholder='Select category'
                          searchPlaceholder='Search category...'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='level'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select level' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='Beginner'>Beginner</SelectItem>
                          <SelectItem value='Intermediate'>
                            Intermediate
                          </SelectItem>
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
                      <MultiSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={TECHNOLOGIES_OPTIONS}
                        placeholder='Select technologies...'
                      />
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
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
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
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
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
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
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
            Save Course
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
