import type { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader, EntityActionsCell } from '@/components/data-table'

import type { ProjectListItem } from '@/service/projects/projects.type'

interface GetColumnsProps {
  onEdit: (project: ProjectListItem) => void
  onDelete: (project: ProjectListItem) => void
}

export const getProjectsColumns = ({
  onEdit,
  onDelete,
}: GetColumnsProps): ColumnDef<ProjectListItem>[] => [
  {
    accessorKey: 'image_url',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Image' />
    ),
    cell: ({ row }) => {
      const url = row.getValue('image_url') as string | null
      const title = row.original.title
      return url ? (
        <img
          src={url}
          alt={title}
          className='h-9 w-14 shrink-0 rounded-md border object-cover'
          loading='lazy'
        />
      ) : (
        <div className='h-9 w-14 shrink-0 rounded-md border bg-muted' />
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Project' />
    ),
    cell: ({ row }) => (
      <span className='max-w-[200px] truncate font-medium'>
        {row.getValue('title')}
      </span>
    ),
  },
  {
    accessorKey: 'difficulty',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Difficulty' />
    ),
    cell: ({ row }) => (
      <span className='capitalize'>{row.getValue('difficulty')}</span>
    ),
  },
  {
    accessorKey: 'github_url',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='GitHub URL' />
    ),
    cell: ({ row }) => {
      const url = row.getValue('github_url') as string
      if (!url) return <span className='text-xs text-muted-foreground'>—</span>
      return (
        <a
          href={url}
          target='_blank'
          rel='noreferrer'
          className='max-w-[260px] truncate text-sm text-primary underline-offset-2 hover:underline'
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
