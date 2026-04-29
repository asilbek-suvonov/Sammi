import { lazy, Suspense, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, FileVideo, Layers3, PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { type Lesson, type Module } from '@/data/mock-data'
import { useCourseActions, useCourses } from '@/stores/selectors'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Main } from '@/components/layout/main'
import { DashboardBreadcrumb } from '@/components/layout/dashboard-breadcrumb'
import { ModuleCard } from './module-card'

const ModuleSheet = lazy(() =>
  import('./module-sheet').then((m) => ({ default: m.ModuleSheet }))
)
const VideoSheet = lazy(() =>
  import('./video-sheet').then((m) => ({ default: m.VideoSheet }))
)

interface AdminCourseDetailProps {
  id: string
}

export function AdminCourseDetail({ id }: AdminCourseDetailProps) {
  const courses = useCourses()
  const { deleteModule, deleteLesson } = useCourseActions()
  const course = useMemo(() => courses.find((c) => c.id === id), [courses, id])

  const [openModuleId, setOpenModuleId] = useState<string | null>(null)

  const [moduleSheetOpen, setModuleSheetOpen] = useState(false)
  const [editingModule, setEditingModule] = useState<Module | null>(null)

  const [videoSheetOpen, setVideoSheetOpen] = useState(false)
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)

  const [deleteModuleOpen, setDeleteModuleOpen] = useState(false)
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null)

  const [deleteVideoOpen, setDeleteVideoOpen] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState<{ moduleId: string; lesson: Lesson } | null>(null)

  const handleAddModule = () => {
    setEditingModule(null)
    setModuleSheetOpen(true)
  }

  const handleEditModule = (module: Module) => {
    setEditingModule(module)
    setModuleSheetOpen(true)
  }

  const handleModuleSheetOpenChange = (open: boolean) => {
    setModuleSheetOpen(open)
    if (!open) setEditingModule(null)
  }

  const handleAddVideo = (module: Module) => {
    setActiveModuleId(module.id)
    setEditingLesson(null)
    setVideoSheetOpen(true)
    setOpenModuleId(module.id)
  }

  const handleEditVideo = (module: Module, lesson: Lesson) => {
    setActiveModuleId(module.id)
    setEditingLesson(lesson)
    setVideoSheetOpen(true)
  }

  const handleVideoSheetOpenChange = (open: boolean) => {
    setVideoSheetOpen(open)
    if (!open) {
      setEditingLesson(null)
    }
  }

  const handleDeleteModule = (module: Module) => {
    setModuleToDelete(module)
    setDeleteModuleOpen(true)
  }

  const handleConfirmDeleteModule = () => {
    if (!course || !moduleToDelete) return
    deleteModule(course.id, moduleToDelete.id)
    if (openModuleId === moduleToDelete.id) setOpenModuleId(null)
    toast.success('Module deleted')
    setModuleToDelete(null)
    setDeleteModuleOpen(false)
  }

  const handleDeleteVideo = (module: Module, lesson: Lesson) => {
    setVideoToDelete({ moduleId: module.id, lesson })
    setDeleteVideoOpen(true)
  }

  const handleConfirmDeleteVideo = () => {
    if (!course || !videoToDelete) return
    deleteLesson(course.id, videoToDelete.moduleId, videoToDelete.lesson.id)
    toast.success('Video deleted')
    setVideoToDelete(null)
    setDeleteVideoOpen(false)
  }

  const toggleModule = (moduleId: string, open: boolean) => {
    setOpenModuleId(open ? moduleId : null)
  }

  if (!course) {
    return (
      <>
        <Main>
          <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center'>
            <h1 className='text-2xl font-semibold'>Course not found</h1>
            <p className='text-sm text-muted-foreground'>
              The course you are looking for does not exist or has been removed.
            </p>
            <Button asChild>
              <Link to='/dashboard/courses'>
                <ArrowLeft className='mr-2 size-4' />
                Back to courses
              </Link>
            </Button>
          </div>
        </Main>
      </>
    )
  }

  const moduleCount = course.modules.length
  const videoCount = course.modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => !!l.videoUrl).length,
    0
  )

  return (
    <>
      <Main>
        <DashboardBreadcrumb
          className='mb-4'
          items={[
            { label: 'Dashboard', to: '/dashboard/overview' },
            { label: 'Courses', to: '/dashboard/courses' },
            { label: course.title },
          ]}
        />

        <div className='flex flex-col gap-6 md:flex-row md:items-start md:justify-between'>
          <div className='flex min-w-0 items-start gap-4'>
            {course.image && (
              <img
                src={course.image}
                alt={course.title}
                className='h-20 w-32 shrink-0 rounded-md border object-cover'
              />
            )}
            <div className='min-w-0 space-y-2'>
              <div className='flex flex-wrap items-center gap-2'>
                <Badge variant='outline'>{course.level}</Badge>
                {course.category && <Badge variant='secondary'>{course.category}</Badge>}
                {course.is_published ? (
                  <Badge className='bg-green-600 text-white hover:bg-green-700'>Published</Badge>
                ) : (
                  <Badge variant='outline'>Draft</Badge>
                )}
              </div>
              <h1 className='truncate text-2xl font-bold tracking-tight'>{course.title}</h1>
              <p className='line-clamp-2 max-w-2xl text-sm text-muted-foreground'>
                {course.description}
              </p>
            </div>
          </div>
          <Button onClick={handleAddModule} className='shrink-0'>
            <PlusIcon className='mr-2 size-4' />
            Add Module
          </Button>
        </div>

        <Separator className='my-6' />

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-semibold'>Modules</h2>
              <p className='text-sm text-muted-foreground'>
                <span className='inline-flex items-center gap-1.5'>
                  <Layers3 className='size-3.5' />
                  {moduleCount} {moduleCount === 1 ? 'module' : 'modules'}
                </span>
                <span className='mx-2 text-muted-foreground/40'>•</span>
                <span className='inline-flex items-center gap-1.5'>
                  <FileVideo className='size-3.5' />
                  {videoCount} {videoCount === 1 ? 'video' : 'videos'}
                </span>
              </p>
            </div>
          </div>

          {moduleCount === 0 ? (
            <EmptyModules onAdd={handleAddModule} />
          ) : (
            <div className='space-y-3'>
              {course.modules.map((module, i) => (
                <ModuleCard
                  key={module.id}
                  index={i}
                  module={module}
                  open={openModuleId === module.id}
                  onOpenChange={(open) => toggleModule(module.id, open)}
                  onEditModule={handleEditModule}
                  onDeleteModule={handleDeleteModule}
                  onAddVideo={handleAddVideo}
                  onEditVideo={handleEditVideo}
                  onDeleteVideo={handleDeleteVideo}
                />
              ))}
            </div>
          )}
        </div>
      </Main>

      <Suspense fallback={null}>
        <ModuleSheet
          open={moduleSheetOpen}
          onOpenChange={handleModuleSheetOpenChange}
          courseId={course.id}
          module={editingModule}
          onCreated={(moduleId) => setOpenModuleId(moduleId)}
        />

        {activeModuleId && (
          <VideoSheet
            open={videoSheetOpen}
            onOpenChange={handleVideoSheetOpenChange}
            courseId={course.id}
            moduleId={activeModuleId}
            lesson={editingLesson}
          />
        )}
      </Suspense>

      <ConfirmDialog
        open={deleteModuleOpen}
        onOpenChange={setDeleteModuleOpen}
        title='Delete Module'
        desc={
          <span>
            Are you sure you want to delete{' '}
            <strong>{moduleToDelete?.title}</strong>? All videos in this module
            will also be removed.
          </span>
        }
        confirmText='Delete'
        destructive
        handleConfirm={handleConfirmDeleteModule}
      />

      <ConfirmDialog
        open={deleteVideoOpen}
        onOpenChange={setDeleteVideoOpen}
        title='Delete Video'
        desc={
          <span>
            Are you sure you want to delete{' '}
            <strong>{videoToDelete?.lesson.title}</strong>? This action cannot
            be undone.
          </span>
        }
        confirmText='Delete'
        destructive
        handleConfirm={handleConfirmDeleteVideo}
      />
    </>
  )
}

function EmptyModules({ onAdd }: { onAdd: () => void }) {
  return (
    <div className='flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center'>
      <div className='flex size-12 items-center justify-center rounded-full bg-muted'>
        <Layers3 className='size-5 text-muted-foreground' />
      </div>
      <div className='space-y-1'>
        <p className='text-sm font-medium'>No modules yet</p>
        <p className='text-xs text-muted-foreground'>
          Add your first module to start building this course.
        </p>
      </div>
      <Button size='sm' onClick={onAdd}>
        <PlusIcon className='mr-2 size-4' />
        Add Module
      </Button>
    </div>
  )
}
