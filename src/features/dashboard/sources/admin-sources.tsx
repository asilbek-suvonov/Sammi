import { lazy, Suspense, useMemo } from 'react'
import { toast } from 'sonner'
import { useEntityCrud } from '@/hooks/use-entity-crud'
import { useEntityTable } from '@/hooks/use-entity-table'
import { type AdminSource } from '@/stores/admin-store'
import { useSourceActions, useSources } from '@/stores/selectors'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityTablePage } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { getSourcesColumns } from './columns'

const SourceDialog = lazy(() =>
  import('./source-dialog').then((m) => ({ default: m.SourceDialog }))
)

export default function AdminSources() {
  const sources = useSources()
  const { deleteSource } = useSourceActions()

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
  } = useEntityCrud<AdminSource>()

  const columns = useMemo(
    () => getSourcesColumns({ onEdit: openEdit, onDelete: askDelete }),
    [openEdit, askDelete]
  )

  const { table } = useEntityTable({ data: sources, columns })

  const handleConfirmDelete = () => {
    confirmDelete((source) => {
      deleteSource(source.id)
      toast.success('Source deleted successfully')
    })
  }

  const handleBulkDelete = (ids: string[]) => {
    ids.forEach((id) => deleteSource(id))
    toast.success(`${ids.length} source(s) deleted`)
  }

  return (
    <>
      <Main fixed>
        <EntityTablePage<AdminSource>
          title='Sources'
          description='Manage code sources and repository links.'
          addLabel='Add Source'
          searchPlaceholder='Search sources...'
          emptyMessage='No sources found.'
          entityName='source'
          table={table}
          onAdd={openCreate}
          onBulkDelete={handleBulkDelete}
        />
      </Main>

      <Suspense fallback={null}>
        <SourceDialog
          open={editorOpen}
          onOpenChange={setEditorOpen}
          source={selected}
        />
      </Suspense>

      <ConfirmDialog
        open={!!deletePending}
        onOpenChange={(open) => !open && cancelDelete()}
        title='Delete Source'
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
