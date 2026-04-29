import { lazy, Suspense, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { type Course } from '@/data/mock-data'
import { toast } from 'sonner'
import { useEntityCrud } from '@/hooks/use-entity-crud'
import { useEntityTable } from '@/hooks/use-entity-table'
import { useCourseActions, useCourses } from '@/stores/selectors'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityTablePage } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { getCoursesColumns } from './columns'

const CourseSheet = lazy(() =>
  import('./course-sheet').then((m) => ({ default: m.CourseSheet }))
)

export default function AdminCoursesView() {
  const navigate = useNavigate()
  const courses = useCourses()
  const { deleteCourse } = useCourseActions()

  const {
    editorOpen,
    setEditorOpen,
    selected,
    openCreate,
    openEdit,
    deletePending,
    askDelete,
    cancelDelete,
    confirmDelete,
  } = useEntityCrud<Course>()

  const columns = useMemo(
    () => getCoursesColumns({ onEdit: openEdit, onDelete: askDelete }),
    [openEdit, askDelete]
  )

  const { table } = useEntityTable({ data: courses, columns })

  const handleConfirmDelete = () => {
    confirmDelete((course) => {
      deleteCourse(course.id)
      toast.success('Course deleted successfully')
    })
  }

  const handleBulkDelete = (ids: string[]) => {
    ids.forEach((id) => deleteCourse(id))
    toast.success(`${ids.length} course(s) deleted`)
  }

  return (
    <>
      <Main fixed>
        <EntityTablePage<Course>
          title='Courses'
          description='Manage your courses — add, edit, or remove.'
          addLabel='Add Course'
          searchPlaceholder='Search courses...'
          emptyMessage='No courses found.'
          entityName='course'
          table={table}
          filters={[
            {
              columnId: 'level',
              title: 'Level',
              options: [
                { label: 'Beginner', value: 'Beginner' },
                { label: 'Intermediate', value: 'Intermediate' },
                { label: 'Advanced', value: 'Advanced' },
              ],
            },
            {
              columnId: 'is_published',
              title: 'Status',
              options: [
                { label: 'Published', value: 'true' },
                { label: 'Draft', value: 'false' },
              ],
            },
          ]}
          onAdd={openCreate}
          onBulkDelete={handleBulkDelete}
          onRowClick={(course) =>
            navigate({
              to: '/dashboard/courses/$id',
              params: { id: course.id },
            })
          }
        />
      </Main>

      <Suspense fallback={null}>
        <CourseSheet
          open={editorOpen}
          onOpenChange={setEditorOpen}
          course={selected}
        />
      </Suspense>

      <ConfirmDialog
        open={!!deletePending}
        onOpenChange={(open) => !open && cancelDelete()}
        title='Delete Course'
        desc={
          <span>
            Are you sure you want to delete{' '}
            <strong>{deletePending?.title}</strong>? This action cannot be
            undone.
          </span>
        }
        confirmText='Delete'
        destructive
        handleConfirm={handleConfirmDelete}
      />
    </>
  )
}
