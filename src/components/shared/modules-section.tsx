import { useModules, useCreateModule } from '@/api-hooks/module' 
import { AddModuleDialog } from './add-module-dialog'
import { Button } from '@/components/ui/button'
import { Plus, Loader2, LayoutGrid } from 'lucide-react'
import { toast } from 'sonner'

interface ModulesSectionProps {
  courseId: number
}

export function ModulesSection({ courseId }: ModulesSectionProps) {
  const { data: allModules = [], isLoading } = useModules()
  const createModule = useCreateModule()

  // Kursga tegishli modullarni filter va sort qilish
  const courseModules = allModules
    .filter((m) => m.course === courseId)
    .sort((a, b) => a.order - b.order)

  const handleAddModule = () => {
    const nextOrder = courseModules.length > 0 
      ? Math.max(...courseModules.map(m => m.order)) + 1 
      : 1

    createModule.mutate({ 
      course: courseId, 
      title: `Yangi modul ${courseModules.length + 1}`, 
      order: nextOrder 
    }, {
      onSuccess: () => {
        toast.success("Yangi modul qo'shildi. Nomini o'zgartirish uchun ustiga ikki marta bosing.")
      }
    })
  }

  return (
    <div className='mt-8 max-w-7xl mx-auto px-4'>
      {/* Header qismi */}
      <div className='mb-8 flex items-end justify-between border-b pb-6'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-primary mb-1'>
            <LayoutGrid className='size-5' />
            <span className='text-xs font-bold uppercase tracking-wider'>O'quv rejasi</span>
          </div>
          <h2 className='text-3xl font-extrabold tracking-tight'>Kurs Modullari</h2>
          <p className='text-sm text-muted-foreground'>
            Jami <span className='font-bold text-foreground'>{courseModules.length} ta</span> modul mavjud
          </p>
        </div>

        <Button 
          onClick={handleAddModule} 
          disabled={createModule.isPending}
          size="lg"
          className="rounded-full px-6 shadow-lg shadow-primary/20 transition-all hover:shadow-xl active:scale-95"
        >
          {createModule.isPending ? (
            <Loader2 className="mr-2 size-5 animate-spin" />
          ) : (
            <Plus className='mr-2 size-5' />
          )}
          Modul qo'shish
        </Button>
      </div>

      {/* Kontent qismi */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Modullar yuklanmoqda...</p>
        </div>
      ) : courseModules.length > 0 ? (
        <AddModuleDialog courseId={courseId} modules={courseModules} />
      ) : (
        <div className='py-20 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center px-4'>
          <div className='size-16 bg-muted rounded-full flex items-center justify-center mb-4'>
            <LayoutGrid className='size-8 text-muted-foreground' />
          </div>
          <h3 className='text-lg font-semibold'>Hozircha modullar yo'q</h3>
          <p className='text-sm text-muted-foreground max-w-[250px] mt-1'>
            Kurs tarkibini shakllantirish uchun birinchi modulni qo'shing.
          </p>
        </div>
      )}
    </div>
  )
}