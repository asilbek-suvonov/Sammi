import { useMemo } from 'react'
import { useFormContext, type Control } from 'react-hook-form'
import { useCategories } from '@/api-hooks/category'
import { useTechnologies } from '@/api-hooks/technology/use-technologies'
import { CategoryQuickAdd } from '@/components/shared/category-quick-add'
import { TechQuickAdd } from '@/components/shared/tech-quick-add'
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
import { type CourseFormValues } from './course-schema'

type Props = {
  control: Control<CourseFormValues>
  isEdit: boolean
}

export function CourseFormFields({ control, isEdit }: Props) {
  const { setValue, getValues } = useFormContext<CourseFormValues>()
  const { data: technologies = [] } = useTechnologies()
  const { data: categoriesRes } = useCategories()

  const techOptions = useMemo(
    () => technologies.map((t) => ({ label: t.label, value: String(t.id) })),
    [technologies]
  )

  const categoryOptions = useMemo(
    () =>
      (categoriesRes?.results ?? []).map((c) => ({
        label: c.name,
        value: String(c.id),
      })),
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
        render={({ field }) => {
          const isUrl = !!field.value && !field.value.startsWith('data:')
          return (
            <FormItem>
              <FormLabel>Image</FormLabel>
              {isEdit && isUrl && (
                <div className='relative h-28 overflow-hidden rounded-md border bg-muted'>
                  <img
                    src={field.value}
                    alt='Current image'
                    className='h-full w-full object-cover'
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  <div className='absolute bottom-0 left-0 right-0 bg-black/40 px-2 py-0.5'>
                    <p className='text-[10px] text-white'>Mavjud rasm</p>
                  </div>
                </div>
              )}
              <FormControl>
                <FileUpload
                  value={isEdit && isUrl ? '' : field.value}
                  onChange={field.onChange}
                  accept='image/*'
                  placeholder={
                    isEdit ? 'Yangi rasm yuklash (ixtiyoriy)' : 'Upload course image'
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />

      <div className='grid grid-cols-2 gap-4'>
        <FormField
          control={control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <div className='flex items-center gap-2'>
                <FormControl>
                  <Combobox
                    value={field.value}
                    onChange={field.onChange}
                    options={categoryOptions}
                    placeholder='Select category'
                    searchPlaceholder='Search category...'
                    className='flex-1'
                  />
                </FormControl>
                <CategoryQuickAdd
                  onCreated={(cat) => setValue('category', String(cat.id))}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='level'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className='w-full'>
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
            <div className='flex items-center gap-2'>
              <FormControl>
                <MultiSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={techOptions}
                  placeholder='Select technologies...'
                  className='flex-1'
                />
              </FormControl>
              <TechQuickAdd
                onCreated={(tech) => {
                  const current = getValues('technologies')
                  setValue('technologies', [...current, String(tech.id)])
                }}
              />
            </div>
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

      <FormField
        control={control}
        name='is_published'
        render={({ field }) => (
          <FormItem className='flex items-center justify-between rounded-lg border p-3'>
            <div className='space-y-0.5'>
              <FormLabel className='text-sm'>Published</FormLabel>
              <FormDescription className='text-xs'>
                Visible to users on the public site.
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  )
}
