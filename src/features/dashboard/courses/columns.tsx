import type { ColumnDef } from '@tanstack/react-table'
import type { Course } from '@/service/course/course.types'
import { DataTableColumnHeader, EntityActionsCell } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'

interface GetColumnsProps {
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
}

export const getCoursesColumns = ({
  onEdit,
  onDelete,
}: GetColumnsProps): ColumnDef<Course>[] => [
  {
    accessorKey: 'image_url',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Image' />
    ),
    cell: ({ row }) => {
      const url = row.getValue('image_url') as string | null
      const title = row.original.title
      return (
        <div className='flex items-center gap-2'>
          {url ? (
            <img
              src={url}
              alt={title}
              className='h-9 w-14 shrink-0 rounded-md border object-cover'
              loading='lazy'
            />
          ) : (
            <div className='h-9 w-14 shrink-0 rounded-md border bg-muted' />
          )}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kurs nomi' />
    ),
    cell: ({ row }) => (
      <span className='max-w-[240px] truncate font-medium'>
        {row.getValue('title')}
      </span>
    ),
  },
  {
    accessorKey: 'category_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ row }) => (
      <span className='max-w-[160px] truncate text-sm text-muted-foreground'>
        {row.getValue('category_name')}
      </span>
    ),
  },
  {
    accessorKey: 'level',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Daraja' />
    ),
    cell: ({ row }) => (
      <Badge variant='outline' className='capitalize'>
        {row.getValue('level')}
      </Badge>
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ row }) => {
      const isFree = Boolean((row.original as Course).is_free)
      const price = row.getValue('price') as string
      return (
        <span className='text-sm'>
          {isFree ? 'Free' : price}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: 'Amallar',
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
