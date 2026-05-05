import { lazy, Suspense, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  useCourses,
  useDeleteCourse,
} from '@/api-hooks/course/use-courses'
import type { Course } from '@/service/course/course.types'
import { useEntityCrud } from '@/hooks/use-entity-crud'
import { useEntityTable } from '@/hooks/use-entity-table'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityTablePage } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { getCoursesColumns } from './columns'

const CourseSheet = lazy(() =>
  import('./course-sheet').then((m) => ({ default: m.CourseSheet }))
)

export default function AdminCoursesView() {
  const navigate = useNavigate()
  const { data: courses = [], isLoading } = useCourses()
  const deleteMutation = useDeleteCourse()

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
    confirmDelete((course) => deleteMutation.mutate(course.id))
  }

  const handleBulkDelete = (ids: (string | number)[]) => {
    ids.forEach((id) => deleteMutation.mutate(id))
  }

  return (
    <>
      <Main fixed>
        <EntityTablePage<Course>
          title='Courses'
          description='Manage your courses — add, edit, or remove.'
          addLabel='Add Course'
          searchPlaceholder='Search courses...'
          emptyMessage={isLoading ? 'Loading...' : 'No courses found.'}
          entityName='course'
          table={table}
          filters={[
            {
              columnId: 'level',
              title: 'Level',
              options: [
                { label: 'Beginner', value: 'beginner' },
                { label: 'Intermediate', value: 'intermediate' },
                { label: 'Advanced', value: 'advanced' },
              ],
            },
          ]}
          onAdd={openCreate}
          onBulkDelete={handleBulkDelete}
          onRowClick={(course) =>
            navigate({
              to: '/dashboard/courses/$id',
              params: { id: String(course.id) },
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
