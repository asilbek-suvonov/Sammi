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
import { type Course } from '@/data/mock-data'
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
import { getCoursesColumns } from './courses/columns'
import { CourseSheet } from './courses/course-sheet'

export default function AdminCoursesView() {
  const { courses, deleteCourse } = useAdminStore()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)

  const handleEdit = (course: Course) => {
    setSelectedCourse(course)
    setSheetOpen(true)
  }

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open)
    if (!open) {
      setSelectedCourse(null)
    }
  }

  const handleDelete = (course: Course) => {
    setCourseToDelete(course)
    setDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (courseToDelete) {
      deleteCourse(courseToDelete.id)
      toast.success('Course deleted successfully')
      setCourseToDelete(null)
      setDeleteOpen(false)
    }
  }

  const handleBulkDelete = () => {
    const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id)
    selectedIds.forEach((id) => deleteCourse(id))
    table.resetRowSelection()
    toast.success(`${selectedIds.length} course(s) deleted`)
  }

  const columns = useMemo(
    () => getCoursesColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    []
  )

  const table = useReactTable({
    data: courses,
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
            <h1 className='text-2xl font-bold tracking-tight'>Courses</h1>
            <p className='text-sm text-muted-foreground'>
              Manage your courses — add, edit, or remove.
            </p>
          </div>
          <Button
            onClick={() => {
              setSelectedCourse(null)
              setSheetOpen(true)
            }}
          >
            <PlusIcon className='mr-2 h-4 w-4' />
            Add Course
          </Button>
        </div>

        <Separator className='my-4' />

        <div className='space-y-4'>
          <DataTableToolbar
            table={table}
            searchPlaceholder='Search courses...'
            filters={[
              {
                columnId: 'level',
                title: 'Level',
                options: [
                  { label: 'Beginner', value: 'Beginner' },
                  { label: 'Intermediate', value: 'Intermediate' },
                  { label: 'Advanced', value: 'Advanced' },
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
                      No courses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <DataTablePagination table={table} />
        </div>

        <DataTableBulkActions table={table} entityName='course'>
          <Button variant='destructive' size='sm' onClick={handleBulkDelete}>
            <Trash2 className='mr-2 h-4 w-4' />
            Delete Selected
          </Button>
        </DataTableBulkActions>
      </Main>

      <CourseSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        course={selectedCourse}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title='Delete Course'
        desc={
          <span>
            Are you sure you want to delete{' '}
            <strong>{courseToDelete?.title}</strong>? This action cannot be
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
