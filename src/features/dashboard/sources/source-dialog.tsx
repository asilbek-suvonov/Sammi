import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useCreateSource,
  useUpdateSource,
} from '@/api-hooks/sources/useSources'
import type { SourceCode } from '@/service/sources/sources.type'
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
  github_url: z.string().url('Must be a valid URL'),
})

type SourceFormValues = z.infer<typeof sourceSchema>

const defaultValues: SourceFormValues = {
  title: '',
  github_url: '',
}

type SourceDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  source?: SourceCode | null
}

export function SourceDialog({ open, onOpenChange, source }: SourceDialogProps) {
  const isEdit = !!source
  const createMutation = useCreateSource()
  const updateMutation = useUpdateSource()
  const submitting = createMutation.isPending || updateMutation.isPending

  const form = useForm<SourceFormValues>({
    resolver: zodResolver(sourceSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(
        source
          ? { title: source.title, github_url: source.github_url }
          : defaultValues
      )
    }
  }, [open, source, form])

  const onSubmit = async (values: SourceFormValues) => {
    if (isEdit && source) {
      await updateMutation.mutateAsync({ slug: source.slug, data: values })
    } else {
      await createMutation.mutateAsync(values)
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
              name='github_url'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository URL</FormLabel>
                  <FormControl>
                    <Input placeholder='https://example.com/repo' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='gap-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button type='submit' form='source-form' disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update Source' : 'Add Source'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
