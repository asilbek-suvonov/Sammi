import { useCallback, useState } from 'react'

export function useEntityCrud<T>() {
  const [editorOpen, setEditorOpenState] = useState(false)
  const [selected, setSelected] = useState<T | null>(null)
  const [deletePending, setDeletePending] = useState<T | null>(null)

  const openCreate = useCallback(() => {
    setSelected(null)
    setEditorOpenState(true)
  }, [])

  const openEdit = useCallback((entity: T) => {
    setSelected(entity)
    setEditorOpenState(true)
  }, [])

  const setEditorOpen = useCallback((open: boolean) => {
    setEditorOpenState(open)
    if (!open) setSelected(null)
  }, [])

  const askDelete = useCallback((entity: T) => {
    setDeletePending(entity)
  }, [])

  const cancelDelete = useCallback(() => {
    setDeletePending(null)
  }, [])

  const confirmDelete = useCallback(
    (handler: (entity: T) => void) => {
      const current = deletePending
      if (!current) return
      setDeletePending(null)
      handler(current)
    },
    [deletePending]
  )

  return {
    editorOpen,
    setEditorOpen,
    selected,
    openCreate,
    openEdit,
    deletePending,
    askDelete,
    cancelDelete,
    confirmDelete,
  }
}
