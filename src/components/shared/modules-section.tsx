import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Module, ModuleCard } from '@/components/shared/module-card'
import { AddModuleDialog } from '@/components/shared/add-module-dialog'
import { AddVideoSheet, VideoFormData } from './add-video-sheet';

export function ModulesSection() {
  const [modules, setModules] = useState<Module[]>([])
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false)
  const [videoSheetOpen, setVideoSheetOpen] = useState(false)
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null)

  const handleAddModule = (title: string) => {
    setModules((prev) => [...prev, { id: Date.now(), title, videos: [] }])
  }

  const openAddVideo = (moduleId: number) => {
    setActiveModuleId(moduleId)
    setVideoSheetOpen(true)
  }

  const handleAddVideo = (video: VideoFormData) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === activeModuleId
          ? { ...m, videos: [...m.videos, { id: Date.now(), ...video }] }
          : m,
      ),
    )
  }

  return (
    <div className='mt-6'>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Modullar</h2>
        <Button size='sm' onClick={() => setModuleDialogOpen(true)}>
          <Plus className='mr-2 size-4' />
          Modul qo'shish
        </Button>
      </div>

      {modules.length > 0 ? (
        <div className='space-y-3'>
          {modules.map((m, i) => (
            <ModuleCard
              key={m.id}
              order={i + 1}
              module={m}
              onAddVideo={() => openAddVideo(m.id)}
            />
          ))}
        </div>
      ) : (
        <p className='rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground'>
          Hali modul qo'shilmagan. Boshlash uchun "Modul qo'shish" tugmasini bosing.
        </p>
      )}

      <AddModuleDialog
        open={moduleDialogOpen}
        onOpenChange={setModuleDialogOpen}
        onAdd={handleAddModule}
      />
      <AddVideoSheet
        open={videoSheetOpen}
        onOpenChange={setVideoSheetOpen}
        onAdd={handleAddVideo}
      />
    </div>
  )
}
