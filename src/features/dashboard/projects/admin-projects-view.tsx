import { lazy, Suspense, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { type Project } from '@/data/mock-data'
import { toast } from 'sonner'
import { useEntityCrud } from '@/hooks/use-entity-crud'
import { useEntityTable } from '@/hooks/use-entity-table'
import { useProjectActions, useProjects } from '@/stores/selectors'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityTablePage } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { getProjectsColumns } from './columns'

const ProjectSheet = lazy(() =>
  import('./project-sheet').then((m) => ({ default: m.ProjectSheet }))
)

export default function AdminProjectsView() {
  const navigate = useNavigate()
  const projects = useProjects()
  const { deleteProject } = useProjectActions()

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
  } = useEntityCrud<Project>()

  const columns = useMemo(
    () => getProjectsColumns({ onEdit: openEdit, onDelete: askDelete }),
    [openEdit, askDelete]
  )

  const { table } = useEntityTable({ data: projects, columns })

  const handleConfirmDelete = () => {
    confirmDelete((project) => {
      deleteProject(project.id)
      toast.success('Project deleted successfully')
    })
  }

  const handleBulkDelete = (ids: string[]) => {
    ids.forEach((id) => deleteProject(id))
    toast.success(`${ids.length} project(s) deleted`)
  }

  return (
    <>
      <Main fixed>
        <EntityTablePage<Project>
          title='Projects'
          description='Manage your projects — add, edit, or remove.'
          addLabel='Add Project'
          searchPlaceholder='Search projects...'
          emptyMessage='No projects found.'
          entityName='project'
          table={table}
          filters={[
            {
              columnId: 'difficulty',
              title: 'Difficulty',
              options: [
                { label: 'Easy', value: 'Easy' },
                { label: 'Medium', value: 'Medium' },
                { label: 'Hard', value: 'Hard' },
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
          onRowClick={(project) =>
            navigate({
              to: '/dashboard/projects/$id',
              params: { id: project.id },
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
        onOpenChange={(open) => !open && cancelDelete()}
        title='Delete Project'
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
