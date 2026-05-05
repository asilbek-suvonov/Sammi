import { lazy, Suspense, useMemo } from 'react'
import {
  useDeleteSource,
  useSources,
} from '@/api-hooks/sources/useSources'
import type { SourceCode } from '@/service/sources/sources.type'
import { useEntityCrud } from '@/hooks/use-entity-crud'
import { useEntityTable } from '@/hooks/use-entity-table'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityTablePage } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { getSourcesColumns } from './columns'

const SourceDialog = lazy(() =>
  import('./source-dialog').then((m) => ({ default: m.SourceDialog }))
)

export default function AdminSources() {
  const { data, isLoading } = useSources()
  const sources = useMemo(() => data?.results ?? [], [data])
  const deleteMutation = useDeleteSource()

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
  } = useEntityCrud<SourceCode>()

  const columns = useMemo(
    () => getSourcesColumns({ onEdit: openEdit, onDelete: askDelete }),
    [openEdit, askDelete]
  )

  const { table } = useEntityTable({ data: sources, columns })

  const handleConfirmDelete = () => {
    confirmDelete((source) => deleteMutation.mutate(source.slug))
  }

  const handleBulkDelete = (ids: (string | number)[]) => {
    ids.forEach((id) => {
      const source = sources.find((s) => s.id === id)
      if (source) deleteMutation.mutate(source.slug)
    })
  }

  return (
    <>
      <Main fixed>
        <EntityTablePage<SourceCode>
          title='Sources'
          description='Manage code sources and repository links.'
          addLabel='Add Source'
          searchPlaceholder='Search sources...'
          emptyMessage={isLoading ? 'Loading...' : 'No sources found.'}
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
