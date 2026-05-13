import { ColumnDef } from '@tanstack/react-table'

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
    accessorKey: 'technologies',
    header: 'Technologies',
    cell: ({ row }) => (
      <div className='flex flex-wrap gap-1'>
        {((row.getValue('technologies') as any[]) || [])
          .slice(0, 3)
          .map((t: any) => (
            <span
              key={t.id}
              className='rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground'
            >
              {t.label}
            </span>
          ))}
      </div>
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

