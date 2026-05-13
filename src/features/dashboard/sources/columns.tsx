import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader, EntityActionsCell } from '@/components/data-table'

import type { SourceCode } from '@/service/sources/sources.type'

interface GetColumnsProps {
  onEdit: (s: SourceCode) => void
  onDelete: (s: SourceCode) => void
}

export const getSourcesColumns = ({
  onEdit,
  onDelete,
}: GetColumnsProps): ColumnDef<SourceCode>[] => [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => (
      <span className='max-w-[200px] truncate font-medium'>
        {row.getValue('title')}
      </span>
    ),
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Slug' />
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => (
      <span className='text-xs text-muted-foreground'>
        {row.getValue('created_at')}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <EntityActionsCell
        entity={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
]

