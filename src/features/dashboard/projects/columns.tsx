import { type ColumnDef } from '@tanstack/react-table'
import { ExternalLink, ImageIcon } from 'lucide-react'
import type { ProjectListItem } from '@/service/projects/projects.type'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
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
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Title' />
      ),
      cell: ({ row }) => (
        <div className='flex items-center gap-3 max-w-[220px]'>
          {row.original.image_url ? (
            <ImagePreview
              src={row.original.image_url}
              alt={row.original.title}
              className='h-8 w-14 rounded object-cover shrink-0'
            />
          ) : (
            <div className='flex h-8 w-14 shrink-0 items-center justify-center rounded bg-muted'>
              <ImageIcon className='size-4 text-muted-foreground' />
            </div>
          )}
          <span className='truncate font-medium'>{row.getValue('title')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'difficulty',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Difficulty' />
      ),
      cell: ({ row }) => {
        const difficulty = row.getValue('difficulty') as string | undefined
        if (!difficulty) return <span className='text-muted-foreground'>—</span>
        return (
          <Badge variant={difficultyVariantMap[difficulty] ?? 'outline'} className='capitalize'>
            {row.original.difficulty_display || difficulty}
          </Badge>
        )
      },
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'technologies',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Technologies' />
      ),
      cell: ({ row }) => {
        const tech = row.original.technologies ?? []
        const visible = tech.slice(0, 2)
        const hidden = tech.slice(2)
        return (
          <div className='flex flex-wrap items-center gap-1 max-w-[180px]'>
            {visible.map((t) => (
              <Badge key={t.id} variant='outline' className='text-xs'>
                {t.name}
              </Badge>
            ))}
            {hidden.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant='secondary' className='cursor-default text-xs'>
                    +{hidden.length}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side='top' className='max-w-xs'>
                  <div className='flex flex-wrap gap-1'>
                    {hidden.map((t) => (
                      <span
                        key={t.id}
                        className='rounded-sm bg-primary-foreground/10 px-1.5 py-0.5 text-[11px]'
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'github_url',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='GitHub' />
      ),
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
      accessorKey: 'demo_url',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Demo' />
      ),
      cell: ({ row }) => {
        const url = row.getValue('demo_url') as string | undefined
        if (!url) return <span className='text-muted-foreground'>—</span>
        return (
          <a
            href={url}
            target='_blank'
            rel='noreferrer'
            className='inline-flex items-center gap-1 text-sm text-blue-500 hover:underline'
          >
            Demo <ExternalLink className='h-3 w-3' />
          </a>
        )
      },
    },
    {
      accessorKey: 'total_steps',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Steps' />
      ),
      cell: ({ row }) => (
        <span className='text-sm font-medium'>{row.getValue('total_steps')}</span>
      ),
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
