import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { type Module } from '@/data/mock-data'
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
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const moduleSchema = z.object({
  title: z.string().min(1, 'Module title is required'),
})

type ModuleFormValues = z.infer<typeof moduleSchema>

const defaultValues: ModuleFormValues = {
  title: '',
}

type ModuleSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: string
  module?: Module | null
  onCreated?: (moduleId: string) => void
}

export function ModuleSheet({
  open,
  onOpenChange,
  courseId,
  module,
  onCreated,
}: ModuleSheetProps) {
  const { addModule, updateModule } = useAdminStore()
  const isEdit = !!module

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      if (module) {
        form.reset({ title: module.title })
      } else {
        form.reset(defaultValues)
      }
    }
  }, [open, module, form])

  const onSubmit = (values: ModuleFormValues) => {
    if (isEdit && module) {
      updateModule(courseId, module.id, { title: values.title })
      toast.success('Module updated')
    } else {
      const id = `m_${Date.now()}`
      addModule(courseId, {
        id,
        title: values.title,
        lessons: [],
      })
      toast.success('Module added')
      onCreated?.(id)
    }
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex h-full flex-col gap-0 p-0 sm:max-w-[450px]'>
        <SheetHeader className='px-6 pt-2 pb-2'>
          <SheetTitle>{isEdit ? 'Edit module' : 'New module'}</SheetTitle>
          <SheetDescription className='text-xs'>
            Give the module a name. You can add videos to it after creation.
          </SheetDescription>
        </SheetHeader>
        <Separator />

        <div className='flex-1 overflow-y-auto px-6 py-4'>
          <Form {...form}>
            <form
              id='module-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Introduction to React'
                        autoFocus
                        {...field}
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
          <Button type='submit' form='module-form'>
            {isEdit ? 'Save changes' : 'Create module'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
