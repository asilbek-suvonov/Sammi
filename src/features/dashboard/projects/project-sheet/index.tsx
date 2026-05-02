import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { type Project } from '@/data/mock-data'
import { useProjectActions } from '@/stores/selectors'
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
import { ProjectFormFields } from './project-form-fields'
import {
  projectDefaultValues,
  projectSchema,
  projectToFormValues,
  type ProjectFormValues,
} from './project-schema'

function createProjectId() {
  return String(Date.now())
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
  const { addProject, updateProject } = useProjectActions()
  const isEdit = !!project

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: projectDefaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(project ? projectToFormValues(project) : projectDefaultValues)
    }
  }, [open, project, form])

  const onSubmit = (values: ProjectFormValues) => {
    const shared = {
      title: values.title,
      description: values.description,
      image: values.image,
      difficulty: (values.difficulty as Project['difficulty']) || undefined,
      github_url: values.github_url || undefined,
      demo_url: values.demo_url || undefined,
      tech: values.technologies,
      is_published: values.is_published,
    }

    if (isEdit && project) {
      updateProject(project.id, { ...project, ...shared })
      toast.success('Project updated successfully')
    } else {
      addProject({
        id: createProjectId(),
        ...shared,
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
              <ProjectFormFields control={form.control} isEdit={isEdit} />
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
