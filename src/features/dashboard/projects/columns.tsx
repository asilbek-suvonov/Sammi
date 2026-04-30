import { type ColumnDef } from '@tanstack/react-table'
import { ExternalLink } from 'lucide-react'
import { type Project } from '@/data/mock-data'
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
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

const difficultyVariantMap: Record<string, 'secondary' | 'default' | 'destructive'> = {
  Easy: 'secondary',
  Medium: 'default',
  Hard: 'destructive',
}

export function getProjectsColumns({
  onEdit,
  onDelete,
}: ProjectsColumnsProps): ColumnDef<Project>[] {
  return [
    selectColumn<Project>(),
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Title' />
      ),
      cell: ({ row }) => (
        <div className='flex items-center gap-3 max-w-[220px]'>
          {row.original.image && (
            <ImagePreview
              src={row.original.image}
              alt={row.original.title}
              className='h-8 w-14 rounded object-cover shrink-0'
            />
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
          <Badge variant={difficultyVariantMap[difficulty] ?? 'outline'}>
            {difficulty}
          </Badge>
        )
      },
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'tech',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Technologies' />
      ),
      cell: ({ row }) => {
        const tech = (row.getValue('tech') as string[]) ?? []
        const visible = tech.slice(0, 2)
        const hidden = tech.slice(2)
        return (
          <div className='flex flex-wrap items-center gap-1 max-w-[180px]'>
            {visible.map((t) => (
              <Badge key={t} variant='outline' className='text-xs'>
                {t}
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
                        key={t}
                        className='rounded-sm bg-primary-foreground/10 px-1.5 py-0.5 text-[11px]'
                      >
                        {t}
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
