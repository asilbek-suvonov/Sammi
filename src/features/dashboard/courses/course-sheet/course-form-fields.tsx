import { useTechnologies } from '@/api-hooks/technology/use-technologies';
import { FileUpload } from '@/components/ui/file-upload';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMemo } from 'react';
import { type Control } from 'react-hook-form';
import { type CourseFormValues } from './course-schema';

type Props = {
  control: Control<CourseFormValues>
  isEdit: boolean
}

export function CourseFormFields({ control, isEdit }: Props) {
  const { data: technologies = [] } = useTechnologies()

  const techOptions = useMemo(
    () => technologies.map((t) => ({ label: t.name, value: String(t.id) })),
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
                <Input placeholder='Frontend, Backend, ...' {...field} />
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
    </>
  )
}
