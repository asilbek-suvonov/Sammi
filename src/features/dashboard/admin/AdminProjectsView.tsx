import { useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
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
import { type Project } from '@/data/mock-data'
import { PlusIcon, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAdminStore } from '@/stores/admin-store'
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
import { ConfigDrawer } from '@/components/config-drawer'
import { ConfirmDialog } from '@/components/confirm-dialog'
import {
  DataTableBulkActions,
  DataTablePagination,
  DataTableToolbar,
} from '@/components/data-table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { getProjectsColumns } from './projects/columns'
import { ProjectSheet } from './projects/project-sheet'

export default function AdminProjectsView() {
  const navigate = useNavigate()
  const { projects, deleteProject } = useAdminStore()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)

  const handleEdit = (project: Project) => {
    setSelectedProject(project)
    setSheetOpen(true)
  }

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open)
    if (!open) {
      setSelectedProject(null)
    }
  }

  const handleDelete = (project: Project) => {
    setProjectToDelete(project)
    setDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id)
      toast.success('Project deleted successfully')
      setProjectToDelete(null)
      setDeleteOpen(false)
    }
  }

  const handleBulkDelete = () => {
    const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id)
    selectedIds.forEach((id) => deleteProject(id))
    table.resetRowSelection()
    toast.success(`${selectedIds.length} project(s) deleted`)
  }

  const columns = useMemo(
    () => getProjectsColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    []
  )

  const table = useReactTable({
    data: projects,
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
            <h1 className='text-2xl font-bold tracking-tight'>Projects</h1>
            <p className='text-sm text-muted-foreground'>
              Manage your projects — add, edit, or remove.
            </p>
          </div>
          <Button
            onClick={() => {
              setSelectedProject(null)
              setSheetOpen(true)
            }}
          >
            <PlusIcon className='mr-2 h-4 w-4' />
            Add Project
          </Button>
        </div>

        <Separator className='my-4' />

        <div className='space-y-4'>
          <DataTableToolbar
            table={table}
            searchPlaceholder='Search projects...'
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
                      className='cursor-pointer'
                      onClick={(e) => {
                        const target = e.target as HTMLElement
                        if (target.closest('button, a, input, [role="checkbox"], [role="menu"], [role="menuitem"]')) {
                          return
                        }
                        navigate({
                          to: '/dashboard/projects/$id',
                          params: { id: row.original.id },
                        })
                      }}
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
                      No projects found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <DataTablePagination table={table} />
        </div>

        <DataTableBulkActions table={table} entityName='project'>
          <Button variant='destructive' size='sm' onClick={handleBulkDelete}>
            <Trash2 className='mr-2 h-4 w-4' />
            Delete Selected
          </Button>
        </DataTableBulkActions>
      </Main>

      <ProjectSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        project={selectedProject}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title='Delete Project'
        desc={
          <span>
            Are you sure you want to delete{' '}
            <strong>{projectToDelete?.title}</strong>? This action cannot be
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
