import { useMemo, useState } from 'react'
import { useFormContext, type Control } from 'react-hook-form'
import { useTechnologies } from '@/api-hooks/technology/use-technologies'
import type { TechnologyCategory } from '@/service/technology/technology.types'
import { TechQuickAdd } from '@/components/shared/tech-quick-add'
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
import { type ProjectFormValues } from './project-schema'

type Props = {
  control: Control<ProjectFormValues>
  isEdit: boolean
}

const TECH_CATEGORIES: { value: TechnologyCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All categories' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'devops', label: 'DevOps' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'other', label: 'Other' },
]

export function ProjectFormFields({ control, isEdit }: Props) {
  const { setValue, getValues, watch } = useFormContext<ProjectFormValues>()
  const { data: technologies = [] } = useTechnologies()
  const [techCategory, setTechCategory] = useState<TechnologyCategory | 'all'>(
    'all'
  )

  const selectedTechIds = watch('technologies') ?? []

  const techOptions = useMemo(() => {
    const filtered =
      techCategory === 'all'
        ? technologies
        : technologies.filter((t) => t.category === techCategory)
    const selectedSet = new Set(selectedTechIds.map(String))
    const filteredIds = new Set(filtered.map((t) => String(t.id)))
    const extras = technologies.filter(
      (t) => selectedSet.has(String(t.id)) && !filteredIds.has(String(t.id))
    )
    return [...filtered, ...extras].map((t) => ({
      label: t.label,
      value: String(t.id),
    }))
  }, [technologies, techCategory, selectedTechIds])

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
                    isEdit ? 'Yangi rasm yuklash (ixtiyoriy)' : 'Upload project image'
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
          name='difficulty'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className='w-full'>
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

        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select
            value={techCategory}
            onValueChange={(v) => setTechCategory(v as TechnologyCategory | 'all')}
          >
            <FormControl>
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {TECH_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
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
                  value={field.value.map(String)}
                  onChange={(vals) => field.onChange(vals.map(Number))}
                  options={techOptions}
                  placeholder={
                    techCategory === 'all'
                      ? 'Select technologies...'
                      : `Choose from ${techCategory}...`
                  }
                  className='flex-1'
                />
              </FormControl>
              <TechQuickAdd
                defaultCategory={
                  techCategory === 'all' ? undefined : techCategory
                }
                onCreated={(tech) => {
                  const current = getValues('technologies')
                  setValue('technologies', [...current, tech.id])
                }}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
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
