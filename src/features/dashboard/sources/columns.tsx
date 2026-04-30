import { type ColumnDef } from '@tanstack/react-table'
import { ExternalLink } from 'lucide-react'
import { type AdminSource } from '@/stores/admin-store'
import {
  DataTableColumnHeader,
  EntityActionsCell,
  selectColumn,
} from '@/components/data-table'

type SourcesColumnsProps = {
  onEdit: (source: AdminSource) => void
  onDelete: (source: AdminSource) => void
}

export function getSourcesColumns({
  onEdit,
  onDelete,
}: SourcesColumnsProps): ColumnDef<AdminSource>[] {
  return [
    selectColumn<AdminSource>(),
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Title' />
      ),
      cell: ({ row }) => (
        <span className='font-medium'>{row.getValue('title')}</span>
      ),
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Description' />
      ),
      cell: ({ row }) => (
        <span className='text-muted-foreground text-sm max-w-[240px] truncate block'>
          {(row.getValue('description') as string) || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'href',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Link' />
      ),
      cell: ({ row }) => {
        const url = row.getValue('href') as string
        if (!url) return <span className='text-muted-foreground'>—</span>
        return (
          <a
            href={url}
            target='_blank'
            rel='noreferrer'
            className='inline-flex items-center gap-1 text-sm text-blue-500 hover:underline'
          >
            Open <ExternalLink className='h-3 w-3' />
          </a>
        )
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <EntityActionsCell
          entity={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ]
}
