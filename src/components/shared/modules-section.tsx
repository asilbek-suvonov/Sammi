import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'

import { useCreateModule, useModules } from '@/api-hooks/module'
import { Button } from '@/components/ui/button'
import { AddModuleDialog } from './add-module-dialog'

interface Props {
  courseId: number
}

export function ModulesSection({ courseId }: Props) {
  const { data: allModules = [], isLoading } = useModules()
  const createModule = useCreateModule()
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null)

  const courseModules = allModules
    .filter((m) => m.course === courseId)
    .sort((a, b) => a.order - b.order)

  const onAddModule = () => {
    const nextOrder = courseModules.length > 0 ? Math.max(...courseModules.map((m) => m.order)) + 1 : 1
    createModule.mutate(
      { course: courseId, title: `Yangi modul ${courseModules.length + 1}`, order: nextOrder },
      { onSuccess: (newMod) => setEditingModuleId(newMod.id) }
    )
  }

  return (
    <div className='mx-auto mt-6 max-w-7xl sm:px-4'>
      <div className='mb-6 flex items-end justify-between border-b pb-4'>
        <div className="flex sm:flex-col items-start justify-between">
          <h2 className=' hidden sm:block text-xl sm:text-2xl font-bold tracking-tight'>Kurs modullari</h2>
          <p className='text-sm text-muted-foreground hidden sm:block '>
            Ushbu kurs uchun jami {courseModules.length} ta modul yaratilgan
          </p>
        </div>
        <Button onClick={onAddModule} disabled={createModule.isPending} size='sm' className='shadow-sm'>
          {createModule.isPending
            ? <Loader2 className='mr-2 size-4 animate-spin' />
            : <Plus className='mr-2 size-4' />}
          Modul qo'shish
        </Button>
      </div>

      {isLoading ? (
        <div className='flex h-40 items-center justify-center text-muted-foreground'>
          <Loader2 className='mr-2 size-5 animate-spin' />
          Modullar yuklanmoqda...
        </div>
      ) : (
        <AddModuleDialog
          courseId={courseId}
          modules={courseModules}
          editingModuleId={editingModuleId}
          onEditingModuleIdChange={setEditingModuleId}
        />
      )}
    </div>
  )
}
