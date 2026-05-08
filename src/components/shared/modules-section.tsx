import { useModules } from '@/api-hooks/module' // Bu yerda barcha modullarni olish hooki
import { AddModuleDialog } from './add-module-dialog'

interface ModulesSectionProps {
  courseId: number
}

export function ModulesSection({ courseId }: ModulesSectionProps) {
  const { data: allModules = [], isLoading } = useModules()

  // Faqat shu kursga tegishli modullarni filter qilamiz
  const courseModules = allModules
    .filter((m) => m.course === courseId)
    .sort((a, b) => a.order - b.order) // Tartib bo'yicha saralash

  return (
    <div className='mt-6 max-w-7xl mx-auto'>
      <div className='mb-6 flex items-center justify-between border-b pb-4'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Kurs Modullari</h2>
          <p className='text-sm text-muted-foreground'>
            Ushbu kurs uchun jami {courseModules.length} ta modul yaratilgan
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-muted-foreground">Modullar yuklanmoqda...</div>
      ) : (
        <AddModuleDialog courseId={courseId} modules={courseModules} />
      )}
    </div>
  )
}