import { type ColumnDef } from '@tanstack/react-table'
import type { Course } from '@/service/course/course.types'
import { Badge } from '@/components/ui/badge'
import {
  DataTableColumnHeader,
  EntityActionsCell,
  selectColumn,
} from '@/components/data-table'
import { ImagePreview } from '@/components/image-preview'

type CoursesColumnsProps = {
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
}

const levelVariantMap: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  beginner: 'secondary',
  intermediate: 'default',
  advanced: 'destructive',
}

export function getCoursesColumns({
  onEdit,
  onDelete,
}: CoursesColumnsProps): ColumnDef<Course>[] {
  return [
    selectColumn<Course>(),
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Title' />
      ),
      cell: ({ row }) => (
        <div className='flex items-center gap-3 max-w-[220px]'>
          {row.original.image_url && (
            <ImagePreview
              src={row.original.image_url}
              alt={row.original.title}
              className='h-8 w-14 rounded object-cover shrink-0'
            />
          )}
          <span className='truncate font-medium'>{row.getValue('title')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'level',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Level' />
      ),
      cell: ({ row }) => {
        const level = row.getValue('level') as string
        return (
          <Badge variant={levelVariantMap[level] ?? 'outline'} className='capitalize'>
            {level}
          </Badge>
        )
      },
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'category_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Category' />
      ),
      cell: ({ row }) => (
        <span className='text-muted-foreground text-sm'>
          {(row.getValue('category_name') as string) || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Price' />
      ),
      cell: ({ row }) =>
        row.original.is_free ? (
          <Badge variant='secondary'>Free</Badge>
        ) : (
          <span className='font-medium'>{row.getValue('price')}</span>
        ),
    },
    {
      accessorKey: 'is_new',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='New' />
      ),
      cell: ({ row }) =>
        row.getValue('is_new') ? (
          <Badge>New</Badge>
        ) : (
          <span className='text-muted-foreground'>—</span>
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
