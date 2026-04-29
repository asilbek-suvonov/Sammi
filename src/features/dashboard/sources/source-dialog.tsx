import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { type AdminSource } from '@/stores/admin-store'
import { useSourceActions } from '@/stores/selectors'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const sourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  href: z.string().min(1, 'Link is required'),
})

type SourceFormValues = z.infer<typeof sourceSchema>

const defaultValues: SourceFormValues = {
  title: '',
  href: '',
}

type SourceDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  source?: AdminSource | null
}

export function SourceDialog({ open, onOpenChange, source }: SourceDialogProps) {
  const { addSource, updateSource } = useSourceActions()
  const isEdit = !!source

  const form = useForm<SourceFormValues>({
    resolver: zodResolver(sourceSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      if (source) {
        form.reset({
          title: source.title,
          href: source.href,
        })
      } else {
        form.reset(defaultValues)
      }
    }
  }, [open, source, form])

  const onSubmit = (values: SourceFormValues) => {
    if (isEdit && source) {
      updateSource(source.id, {
        title: values.title,
        href: values.href,
      })
      toast.success('Source updated successfully')
    } else {
      addSource({
        id: String(Date.now()),
        title: values.title,
        href: values.href,
        description: '',
        stars: 0,
      })
      toast.success('Source added successfully')
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Source' : 'Add New Source'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the source details below.'
              : 'Add a new code source with a title and link.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='source-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Landing Repository' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='href'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Demo / Link URL</FormLabel>
                  <FormControl>
                    <Input placeholder='https://github.com/...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='gap-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type='submit' form='source-form'>
            {isEdit ? 'Update Source' : 'Add Source'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
