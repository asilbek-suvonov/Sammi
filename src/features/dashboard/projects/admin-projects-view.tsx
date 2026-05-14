import { lazy, Suspense, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import {
  useDeleteProject,
  useProjects,
} from '@/api-hooks/projects/use-projects'

import type { ProjectListItem } from '@/service/projects/projects.type'

import { useEntityCrud } from '@/hooks/use-entity-crud'
import { useEntityTable } from '@/hooks/use-entity-table'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityTablePage } from '@/components/data-table'
import { Main } from '@/components/layout/main'

import { getProjectsColumns } from './columns'

const ProjectSheet = lazy(() =>
  import('./project-sheet').then((m) => ({
    default: m.ProjectSheet,
  }))
)

export default function AdminProjectsView() {
  const { t } = useTranslation()

  const navigate = useNavigate()

  const { data, isLoading } = useProjects()

  const projects = useMemo(
    () => data?.results ?? [],
    [data]
  )

  const deleteMutation = useDeleteProject()

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
  } = useEntityCrud<ProjectListItem>()

  const columns = useMemo(
    () =>
      getProjectsColumns({
        onEdit: openEdit,
        onDelete: askDelete,
      }),
    [openEdit, askDelete]
  )

  const { table } = useEntityTable({
    data: projects,
    columns,
  })

  const handleConfirmDelete = () => {
    confirmDelete((project) =>
      deleteMutation.mutate(project.id)
    )
  }

  const handleBulkDelete = (
    ids: (string | number)[]
  ) => {
    ids.forEach((id) =>
      deleteMutation.mutate(id)
    )
  }

  return (
    <>
      <Main fixed>
        <EntityTablePage<ProjectListItem>
          title={t('projects')}
          description={t(
            'manageProjectsDescription'
          )}
          addLabel={t('addProject')}
          searchPlaceholder={t(
            'searchProjects'
          )}
          emptyMessage={
            isLoading
              ? t('loading')
              : t('noProjectsFound')
          }
          entityName={t('project')}
          table={table}
          filters={[
            {
              columnId: 'difficulty',
              title: t('difficulty'),
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
          onRowClick={(project) =>
            navigate({
              to: '/dashboard/projects/$id',
              params: {
                id: String(project.id),
              },
            })
          }
        />
      </Main>

      <Suspense fallback={null}>
        <ProjectSheet
          open={editorOpen}
          onOpenChange={setEditorOpen}
          project={selected}
        />
      </Suspense>

      <ConfirmDialog
        open={!!deletePending}
        onOpenChange={(open) =>
          !open && cancelDelete()
        }
        title={t('deleteProject')}
        desc={
          <span>
            {t('deleteProjectConfirm')}{' '}
            <strong>
              {deletePending?.title}
            </strong>
            ?{' '}
            {t(
              'deleteActionWarning'
            )}
          </span>
        }
        confirmText={t('delete')}
        destructive
        handleConfirm={
          handleConfirmDelete
        }
      />
    </>
  )
}
