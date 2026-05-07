import { useTechnologies } from '@/api-hooks/technology/use-technologies'
import { FileUpload } from '@/components/ui/file-upload'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MultiSelect } from '@/components/ui/multi-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useMemo } from 'react'
import { type Control } from 'react-hook-form'
import { type ProjectFormValues } from './project-schema'

type Props = {
  control: Control<ProjectFormValues>
  isEdit: boolean
}

export function ProjectFormFields({ control, isEdit }: Props) {
  const { data: technologies = [] } = useTechnologies()

  const techOptions = useMemo(
    () => technologies.map((t) => ({ label: t.label, value: String(t.id) })),
    [technologies]
  )

  return (
    <>
      <FormField
        control={control}
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
        control={control}
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
        control={control}
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
        control={control}
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
                <SelectItem value='beginner'>Beginner</SelectItem>
                <SelectItem value='intermediate'>Intermediate</SelectItem>
                <SelectItem value='advanced'>Advanced</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='technologies'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Technologies</FormLabel>
            <FormControl>
              <MultiSelect
                value={field.value.map(String)}
                onChange={(vals) => field.onChange(vals.map(Number))}
                options={techOptions}
                placeholder='Select technologies...'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
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
        control={control}
        name='demo_url'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Demo URL</FormLabel>
            <FormControl>
              <Input placeholder='https://demo.example.com' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='rounded-lg border p-3'>
        <FormField
          control={control}
          name='is_published'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-xs'>Published</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormDescription className='text-[10px]'>Visible to users</FormDescription>
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
