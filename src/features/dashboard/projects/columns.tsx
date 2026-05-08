import { type ColumnDef } from '@tanstack/react-table'
import { ExternalLink, ImageIcon } from 'lucide-react'

import type { ProjectListItem } from '@/service/projects/projects.type'
import { Badge } from '@/components/ui/badge'
import {
  DataTableColumnHeader,
  EntityActionsCell,
  selectColumn,
} from '@/components/data-table'
import { ImagePreview } from '@/components/image-preview'

type ProjectsColumnsProps = {
  onEdit: (project: ProjectListItem) => void
  onDelete: (project: ProjectListItem) => void
}

const difficultyVariantMap: Record<string, 'secondary' | 'default' | 'destructive'> = {
  beginner: 'secondary',
  intermediate: 'default',
  advanced: 'destructive',
}

export function getProjectsColumns({
  onEdit,
  onDelete,
}: ProjectsColumnsProps): ColumnDef<ProjectListItem>[] {
  return [
    selectColumn<ProjectListItem>(),

    {
      accessorKey: 'image_url',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Image' />,
      cell: ({ row }) =>
        row.original.image_url ? (
          <ImagePreview
            src={row.original.image_url}
            alt={row.original.title}
            className='h-8 w-14 rounded object-cover'
          />
        ) : (
          <div className='flex h-8 w-14 items-center justify-center rounded bg-muted'>
            <ImageIcon className='size-4 text-muted-foreground' />
          </div>
        ),
      size: 90,
    },

    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Title' />,
      cell: ({ row }) => (
        <div className='max-w-[260px]'>
          <span className='block truncate font-medium'>{row.getValue('title')}</span>
        </div>
      ),
    },

    {
      accessorKey: 'difficulty',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Difficulty' />,
      cell: ({ row }) => {
        const difficulty = row.getValue('difficulty') as string | undefined
        if (!difficulty) return <span className='text-muted-foreground'>—</span>
        return (
          <Badge
            variant={difficultyVariantMap[difficulty] ?? 'outline'}
            className='capitalize'
          >
            {row.original.difficulty_display || difficulty}
          </Badge>
        )
      },
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },

    {
      accessorKey: 'github_url',
      header: ({ column }) => <DataTableColumnHeader column={column} title='GitHub' />,
      cell: ({ row }) => {
        const url = row.getValue('github_url') as string | undefined
        if (!url) return <span className='text-muted-foreground'>—</span>
        return (
          <a
            href={url}
            target='_blank'
            rel='noreferrer'
            className='inline-flex items-center gap-1 text-sm text-blue-500 hover:underline'
          >
            Link <ExternalLink className='h-3 w-3' />
          </a>
        )
      },
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <EntityActionsCell entity={row.original} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ]
}
