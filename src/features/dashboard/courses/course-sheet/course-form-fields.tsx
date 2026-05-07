import { useCategories } from '@/api-hooks/category'
import { useTechnologies } from '@/api-hooks/technology/use-technologies'
import { Combobox } from '@/components/ui/combobox'
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
import { type CourseFormValues } from './course-schema'

type Props = {
  control: Control<CourseFormValues>
  isEdit: boolean
}

export function CourseFormFields({ control, isEdit }: Props) {
  const { data: technologies = [] } = useTechnologies()
  const { data: categoriesRes } = useCategories()

  const techOptions = useMemo(
    () => technologies.map((t) => ({ label: t.label, value: String(t.id) })),
    [technologies]
  )

  const categoryOptions = useMemo(
    () => (categoriesRes?.results ?? []).map((c) => ({ label: c.name, value: String(c.id) })),
    [categoriesRes]
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
              <Input placeholder='React Mastery Course' {...field} />
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
          control={control}
          name='category'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Combobox
                  value={field.value}
                  onChange={field.onChange}
                  options={categoryOptions}
                  placeholder='Select category'
                  searchPlaceholder='Search category...'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='level'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormLabel>Level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select level' />
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
      </div>

      <FormField
        control={control}
        name='technologies'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Technologies</FormLabel>
            <FormControl>
              <MultiSelect
                value={field.value}
                onChange={field.onChange}
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
        name='price'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input placeholder='99.00' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='grid grid-cols-3 gap-4 rounded-lg border p-3'>
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
        <FormField
          control={control}
          name='is_free'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-xs'>Free</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormDescription className='text-[10px]'>Free access</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='is_new'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1'>
              <FormLabel className='text-xs'>New</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormDescription className='text-[10px]'>Show NEW badge</FormDescription>
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
