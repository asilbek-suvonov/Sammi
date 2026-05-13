import { ColumnDef } from '@tanstack/react-table'
import { Course } from '@/service/course/course.types'
import { DataTableColumnHeader } from '../sources/columns'

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
      <DataTableColumnHeader column={column} title="Kurs nomi" />
    ),
    cell: ({ row }) => <span className="max-w-[200px] truncate font-medium">{row.getValue('title')}</span>,
  },
  {
    accessorKey: 'level',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Daraja" />
    ),
  },
  {
    id: 'actions',
    header: 'Amallar',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(row.original); }}
          className="text-sm text-blue-600 hover:underline"
        >
          Tahrirlash
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(row.original); }}
          className="text-sm text-red-600 hover:underline"
        >
          O'chirish
        </button>
      </div>
    ),
  },
]