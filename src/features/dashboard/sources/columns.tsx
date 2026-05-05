import { type ColumnDef } from '@tanstack/react-table'
import { ExternalLink } from 'lucide-react'
import type { SourceCode } from '@/service/sources/sources.type'
import { Badge } from '@/components/ui/badge'
import {
  DataTableColumnHeader,
  EntityActionsCell,
  selectColumn,
} from '@/components/data-table'

type SourcesColumnsProps = {
  onEdit: (source: SourceCode) => void
  onDelete: (source: SourceCode) => void
}

export function getSourcesColumns({
  onEdit,
  onDelete,
}: SourcesColumnsProps): ColumnDef<SourceCode>[] {
  return [
    selectColumn<SourceCode>(),
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
      accessorKey: 'github_url',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='GitHub' />
      ),
      cell: ({ row }) => {
        const url = row.getValue('github_url') as string
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
      accessorKey: 'is_published',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) =>
        row.getValue('is_published') ? (
          <Badge className='bg-green-600 text-white hover:bg-green-700'>
            Published
          </Badge>
        ) : (
          <Badge variant='outline'>Draft</Badge>
        ),
      filterFn: (row, id, value: string[]) =>
        value.includes(String(row.getValue(id))),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Created' />
      ),
      cell: ({ row }) => {
        const value = row.getValue('created_at') as string | undefined
        return (
          <span className='text-muted-foreground text-sm'>
            {value ? new Date(value).toLocaleDateString() : '—'}
          </span>
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
