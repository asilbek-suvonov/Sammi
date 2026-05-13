import { lazy, Suspense, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

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

import {getCoursesColumns}  from './columns'

const CourseSheet = lazy(() =>
  import('./course-sheet').then((m) => ({
    default: m.CourseSheet,
  }))
)

export default function AdminCoursesView() {
  const { t } = useTranslation()

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
    () =>
      getCoursesColumns({
        onEdit: openEdit,
        onDelete: askDelete,
      }),
    [openEdit, askDelete]
  )

  const { table } = useEntityTable({
    data: courses,
    columns,
  })

  const handleConfirmDelete = () => {
    confirmDelete((course) =>
      deleteMutation.mutate(course.id)
    )
  }

  const handleBulkDelete = (ids: (string | number)[]) => {
    ids.forEach((id) => deleteMutation.mutate(id))
  }

  return (
    <>
      <Main fixed>
        <EntityTablePage<Course>
          title={t('courses')}
          description={t(
            'manageCoursesDescription'
          )}
          addLabel={t('addCourse')}
          searchPlaceholder={t('searchCourses')}
          emptyMessage={
            isLoading
              ? t('loading')
              : t('noCoursesFound')
          }
          entityName={t('course')}
          table={table}
          filters={[
            {
              columnId: 'level',
              title: t('level'),
              options: [
                {
                  label: t('beginner'),
                  value: 'beginner',
                },
                {
                  label: t('intermediate'),
                  value: 'intermediate',
                },
                {
                  label: t('advanced'),
                  value: 'advanced',
                },
              ],
            },
          ]}
          onAdd={openCreate}
          onBulkDelete={handleBulkDelete}
          onRowClick={(course) =>
            navigate({
              to: '/dashboard/courses/$id',
              params: {
                id: String(course.id),
              },
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
        onOpenChange={(open) =>
          !open && cancelDelete()
        }
        title={t('deleteCourse')}
        desc={
          <span>
            {t('deleteCourseConfirm')}{' '}
            <strong>
              {deletePending?.title}
            </strong>
            ? {t('deleteActionWarning')}
          </span>
        }
        confirmText={t('delete')}
        destructive
        handleConfirm={handleConfirmDelete}
      />
    </>
  )
}