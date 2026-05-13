import { ColumnDef } from '@tanstack/react-table'
import { Course } from '@/service/course/course.types'
import { DataTableColumnHeader, EntityActionsCell } from '@/components/data-table'

interface GetColumnsProps {
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
}

export const getCoursesColumns = ({
  onEdit,
  onDelete,
}: GetColumnsProps): ColumnDef<Course>[] => [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kurs nomi' />
    ),
    cell: ({ row }) => (
      <span className='max-w-[200px] truncate font-medium'>
        {row.getValue('title')}
      </span>
    ),
  },
  {
    accessorKey: 'level',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Daraja' />
    ),
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
