import { type ColumnDef } from '@tanstack/react-table'
import { type Course } from '@/data/mock-data'
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
  Beginner: 'secondary',
  Intermediate: 'default',
  Advanced: 'destructive',
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
      accessorKey: 'level',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Level' />
      ),
      cell: ({ row }) => {
        const level = row.getValue('level') as string
        return <Badge variant={levelVariantMap[level] ?? 'outline'}>{level}</Badge>
      },
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Category' />
      ),
      cell: ({ row }) => (
        <span className='text-muted-foreground text-sm'>
          {(row.getValue('category') as string) || '—'}
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
