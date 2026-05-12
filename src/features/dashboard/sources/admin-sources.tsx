import { lazy, Suspense, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

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
  import('./source-dialog').then((m) => ({
    default: m.SourceDialog,
  }))
)

export default function AdminSources() {
  const { t } = useTranslation()

  const { data, isLoading } = useSources()

  const sources = useMemo(
    () => data?.results ?? [],
    [data]
  )

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
    () =>
      getSourcesColumns({
        onEdit: openEdit,
        onDelete: askDelete,
      }),
    [openEdit, askDelete]
  )

  const { table } = useEntityTable({
    data: sources,
    columns,
  })

  const handleConfirmDelete = () => {
    confirmDelete((source) =>
      deleteMutation.mutate(source.slug)
    )
  }

  const handleBulkDelete = (
    ids: (string | number)[]
  ) => {
    ids.forEach((id) => {
      const source = sources.find(
        (s) => s.id === id
      )

      if (source) {
        deleteMutation.mutate(source.slug)
      }
    })
  }

  return (
    <>
      <Main fixed>
        <EntityTablePage<SourceCode>
          title={t('sources')}
          description={t(
            'manageSourcesDescription'
          )}
          addLabel={t('addSource')}
          searchPlaceholder={t(
            'searchSources'
          )}
          emptyMessage={
            isLoading
              ? t('loading')
              : t('noSourcesFound')
          }
          entityName={t('source')}
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
        onOpenChange={(open) =>
          !open && cancelDelete()
        }
        title={t('deleteSource')}
        desc={
          <span>
            {t('deleteSourceConfirm')}{' '}
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