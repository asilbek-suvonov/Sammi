import {
  flexRender,
  type Table as TanstackTable,
} from '@tanstack/react-table'
import { PlusIcon, Trash2 } from 'lucide-react'
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
import { PageHeader } from '@/components/shared/page-header'
import { DataTableBulkActions } from './bulk-actions'
import { DataTablePagination } from './pagination'
import { DataTableToolbar } from './toolbar'

type Filter = {
  columnId: string
  title: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

type EntityId = string | number

type Props<T extends { id: EntityId }> = {
  title: string
  description: string
  addLabel: string
  searchPlaceholder: string
  emptyMessage?: string
  table: TanstackTable<T>
  filters?: Filter[]
  onAdd: () => void
  onBulkDelete: (ids: EntityId[]) => void
  onRowClick?: (row: T) => void
  entityName: string
}

const ROW_CLICK_IGNORE_SELECTOR =
  'button, a, input, [role="checkbox"], [role="menu"], [role="menuitem"]'

export function EntityTablePage<T extends { id: EntityId }>({
  title,
  description,
  addLabel,
  searchPlaceholder,
  emptyMessage = 'No items found.',
  table,
  filters,
  onAdd,
  onBulkDelete,
  onRowClick,
  entityName,
}: Props<T>) {
  const columnCount = table.getAllColumns().length

  const handleBulkDelete = () => {
    const ids = table
      .getFilteredSelectedRowModel()
      .rows.map((r) => r.original.id)
    onBulkDelete(ids)
    table.resetRowSelection()
  }

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button onClick={onAdd}>
            <PlusIcon className='mr-2 h-4 w-4' />
            {addLabel}
          </Button>
        }
      />

      <Separator className='my-4' />

      <div className='space-y-4'>
        <DataTableToolbar
          table={table}
          searchPlaceholder={searchPlaceholder}
          filters={filters}
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
                    className={onRowClick ? 'cursor-pointer' : undefined}
                    onClick={
                      onRowClick
                        ? (e) => {
                            const target = e.target as HTMLElement
                            if (target.closest(ROW_CLICK_IGNORE_SELECTOR)) return
                            onRowClick(row.original)
                          }
                        : undefined
                    }
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
                    colSpan={columnCount}
                    className='h-24 text-center text-muted-foreground'
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DataTablePagination table={table} />
      </div>

      <DataTableBulkActions table={table} entityName={entityName}>
        <Button variant='destructive' size='sm' onClick={handleBulkDelete}>
          <Trash2 className='mr-2 h-4 w-4' />
          Delete Selected
        </Button>
      </DataTableBulkActions>
    </>
  )
}
