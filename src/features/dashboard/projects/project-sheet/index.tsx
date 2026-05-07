import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  useCreateProject,
  useUpdateProject,
} from '@/api-hooks/projects/use-projects'
import type {
  ProjectListItem,
  ProjectRequest,
} from '@/service/projects/projects.type'
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
import { dataUrlToFile } from '@/lib/data-url'
import { ProjectFormFields } from './project-form-fields'
import {
  projectDefaultValues,
  projectSchema,
  projectToFormValues,
  type ProjectFormValues,
} from './project-schema'

type ProjectSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: ProjectListItem | null
}

export function ProjectSheet({
  open,
  onOpenChange,
  project,
}: ProjectSheetProps) {
  const isEdit = !!project
  const createMutation = useCreateProject()
  const updateMutation = useUpdateProject()
  const submitting = createMutation.isPending || updateMutation.isPending

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: projectDefaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(project ? projectToFormValues(project) : projectDefaultValues)
    }
  }, [open, project, form])

  const onSubmit = async (values: ProjectFormValues) => {
    const image = await dataUrlToFile(values.image, 'project-image')
    const payload: ProjectRequest = {
      title: values.title,
      description: values.description,
      difficulty: values.difficulty,
      github_url: values.github_url || undefined,
      demo_url: values.demo_url || undefined,
      technologies: values.technologies,
      is_published: values.is_published,
      image: image instanceof File ? image : undefined,
    }

    if (isEdit && project) {
      await updateMutation.mutateAsync({ id: project.id, data: payload })
    } else {
      await createMutation.mutateAsync(payload)
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
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button type='submit' form='project-form' disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Project'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
