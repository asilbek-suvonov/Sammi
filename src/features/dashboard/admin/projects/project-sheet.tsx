import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Project } from '@/data/mock-data'
import { toast } from 'sonner'
import { useAdminStore } from '@/stores/admin-store'
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

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().min(1, 'Image is required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', '']),
  github_url: z.string(),
  demo_url: z.string(),
  technologies: z.array(z.string()),
  is_published: z.boolean(),
})

type ProjectFormValues = z.infer<typeof projectSchema>

const defaultValues: ProjectFormValues = {
  title: '',
  description: '',
  image: '',
  difficulty: '',
  github_url: '',
  demo_url: '',
  technologies: [],
  is_published: false,
}

type ProjectSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project | null
}

export function ProjectSheet({
  open,
  onOpenChange,
  project,
}: ProjectSheetProps) {
  const { addProject, updateProject } = useAdminStore()
  const isEdit = !!project

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      if (project) {
        form.reset({
          title: project.title,
          description: project.description,
          image: project.image,
          difficulty: project.difficulty ?? '',
          github_url: project.github_url ?? '',
          demo_url: project.demo_url ?? '',
          technologies: project.tech ?? [],
          is_published: project.is_published ?? false,
        })
      } else {
        form.reset(defaultValues)
      }
    }
  }, [open, project, form])

  const onSubmit = (values: ProjectFormValues) => {
    if (isEdit && project) {
      updateProject(project.id, {
        ...project,
        title: values.title,
        description: values.description,
        image: values.image,
        difficulty: (values.difficulty as Project['difficulty']) || undefined,
        github_url: values.github_url || undefined,
        demo_url: values.demo_url || undefined,
        tech: values.technologies,
        is_published: values.is_published,
      })
      toast.success('Project updated successfully')
    } else {
      addProject({
        id: String(Date.now()),
        title: values.title,
        description: values.description,
        image: values.image,
        difficulty: (values.difficulty as Project['difficulty']) || undefined,
        github_url: values.github_url || undefined,
        demo_url: values.demo_url || undefined,
        tech: values.technologies,
        is_published: values.is_published,
        type: 'Full-Stack',
        price: '$0',
        students: 0,
        features: [],
        modules: 0,
        duration: '0h',
      })
      toast.success('Project added successfully')
    }
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex h-full flex-col gap-0 p-0 sm:max-w-[450px]'>
        <SheetHeader className='px-6 pt-2 pb-2'>
          <SheetTitle>Project details</SheetTitle>
          <SheetDescription className='text-xs'>
            Fill in the details to save the project.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <ScrollArea className='relative w-full flex-1 overflow-hidden'>
          <Form {...form}>
            <form
              id='project-form'
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
                      <Input placeholder='E-Commerce Dashboard' {...field} />
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
                        placeholder='Project description...'
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
                        placeholder='Upload project image'
                        hideExistingValue={isEdit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='difficulty'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select difficulty' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Easy'>Easy</SelectItem>
                        <SelectItem value='Medium'>Medium</SelectItem>
                        <SelectItem value='Hard'>Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                name='github_url'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input placeholder='https://github.com/...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='demo_url'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demo URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://demo.example.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
            </form>
          </Form>
        </ScrollArea>
        <Separator />
        <SheetFooter className='flex flex-row justify-end gap-2 px-6 py-4'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type='submit' form='project-form'>
            Save Project
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
