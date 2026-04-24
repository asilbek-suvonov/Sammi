import { useState, useMemo } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import { PlusIcon, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAdminStore, type AdminSource } from '@/stores/admin-store'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfirmDialog } from '@/components/confirm-dialog'
import {
  DataTableBulkActions,
  DataTablePagination,
  DataTableToolbar,
} from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getSourcesColumns } from './sources/columns'
import { SourceDialog } from './sources/source-dialog'

export default function AdminSources() {
  const { sources, deleteSource } = useAdminStore()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedSource, setSelectedSource] = useState<AdminSource | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [sourceToDelete, setSourceToDelete] = useState<AdminSource | null>(null)

  const handleEdit = (source: AdminSource) => {
    setSelectedSource(source)
    setDialogOpen(true)
  }

  const handleDelete = (source: AdminSource) => {
    setSourceToDelete(source)
    setDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (sourceToDelete) {
      deleteSource(sourceToDelete.id)
      toast.success('Source deleted successfully')
      setSourceToDelete(null)
      setDeleteOpen(false)
    }
  }

  const handleBulkDelete = () => {
    const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id)
    selectedIds.forEach((id) => deleteSource(id))
    table.resetRowSelection()
    toast.success(`${selectedIds.length} source(s) deleted`)
  }

  const columns = useMemo(
    () => getSourcesColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    []
  )

  const table = useReactTable({
    data: sources,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Sources</h1>
            <p className='text-sm text-muted-foreground'>
              Manage code sources and repository links.
            </p>
          </div>
          <Button
            onClick={() => {
              setSelectedSource(null)
              setDialogOpen(true)
            }}
          >
            <PlusIcon className='mr-2 h-4 w-4' />
            Add Source
          </Button>
        </div>

        <Separator className='my-4' />

        <div className='space-y-4'>
          <DataTableToolbar
            table={table}
            searchPlaceholder='Search sources...'
          />

          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() ? 'selected' : undefined}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center text-muted-foreground'
                    >
                      No sources found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <DataTablePagination table={table} />
        </div>

        <DataTableBulkActions table={table} entityName='source'>
          <Button variant='destructive' size='sm' onClick={handleBulkDelete}>
            <Trash2 className='mr-2 h-4 w-4' />
            Delete Selected
          </Button>
        </DataTableBulkActions>
      </Main>

      <SourceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        source={selectedSource}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title='Delete Source'
        desc={
          <span>
            Are you sure you want to delete{' '}
            <strong>{sourceToDelete?.title}</strong>? This action cannot be
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
