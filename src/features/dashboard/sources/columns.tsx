import type { ColumnDef } from '@tanstack/react-table'

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
    accessorKey: 'github_url',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Repository URL' />
    ),
    cell: ({ row }) => {
      const url = row.getValue('github_url') as string
      if (!url) return <span className='text-xs text-muted-foreground'>—</span>
      return (
        <a
          href={url}
          target='_blank'
          rel='noreferrer'
          className='max-w-[320px] truncate text-sm text-primary underline-offset-2 hover:underline'
          title={url}
          onClick={(e) => e.stopPropagation()}
        >
          {url}
        </a>
      )
    },
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
