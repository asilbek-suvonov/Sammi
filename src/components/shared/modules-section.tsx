import { useState } from 'react'
import { useCreateModule, useModules } from '@/api-hooks/module'

import { AddModuleDialog } from './add-module-dialog'

import { Button } from '@/components/ui/button'

import { Loader2, Plus } from 'lucide-react'

interface ModulesSectionProps {
  courseId: number
}

export function ModulesSection({
  courseId,
}: ModulesSectionProps) {
  const { data: allModules = [], isLoading } = useModules()

  const createModule = useCreateModule()

  const [editingModuleId, setEditingModuleId] = useState<
    number | null
  >(null)

  const courseModules = allModules
    .filter((module) => module.course === courseId)
    .sort((a, b) => a.order - b.order)

  const onAddModule = () => {
    const nextOrder =
      courseModules.length > 0
        ? Math.max(
            ...courseModules.map((m) => m.order)
          ) + 1
        : 1

    createModule.mutate(
      {
        course: courseId,
        title: `Yangi modul ${
          courseModules.length + 1
        }`,
        order: nextOrder,
      },
      {
        onSuccess: (newModule) => {
          setEditingModuleId(newModule.id)
        },
      }
    )
  }

  return (
    <div className='mx-auto mt-6 max-w-7xl'>
      <div className='mb-6 flex items-center justify-between border-b pb-4'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Kurs modullari
          </h2>

          <p className='text-sm text-muted-foreground'>
            Ushbu kurs uchun jami{' '}
            {courseModules.length} ta modul
            yaratilgan
          </p>
        </div>

        <Button
          onClick={onAddModule}
          disabled={createModule.isPending}
          size='sm'
          className='shadow-sm'
        >
          {createModule.isPending ? (
            <Loader2 className='mr-2 size-4 animate-spin' />
          ) : (
            <Plus className='mr-2 size-4' />
          )}

          Modul qo‘shish
        </Button>
      </div>

      {isLoading ? (
        <div className='py-10 text-center text-muted-foreground'>
          Modullar yuklanmoqda...
        </div>
      ) : (
        <AddModuleDialog
          courseId={courseId}
          modules={courseModules}
        />
      )}
    </div>
  )
}
