import { type ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { type Course } from '@/data/mock-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table'

type CoursesColumnsProps = {
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
}

export function getCoursesColumns({ onEdit, onDelete }: CoursesColumnsProps): ColumnDef<Course>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Title' />,
      cell: ({ row }) => (
        <div className='flex items-center gap-3 max-w-[220px]'>
          {row.original.image && (
            <img
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
      header: ({ column }) => <DataTableColumnHeader column={column} title='Level' />,
      cell: ({ row }) => {
        const level = row.getValue('level') as string
        const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
          Beginner: 'secondary',
          Intermediate: 'default',
          Advanced: 'destructive',
        }
        return <Badge variant={variantMap[level] ?? 'outline'}>{level}</Badge>
      },
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'category',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />,
      cell: ({ row }) => (
        <span className='text-muted-foreground text-sm'>
          {(row.getValue('category') as string) || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'price',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Price' />,
      cell: ({ row }) =>
        row.original.is_free ? (
          <Badge variant='secondary'>Free</Badge>
        ) : (
          <span className='font-medium'>{row.getValue('price')}</span>
        ),
    },
    {
      accessorKey: 'is_new',
      header: ({ column }) => <DataTableColumnHeader column={column} title='New' />,
      cell: ({ row }) =>
        row.getValue('is_new') ? (
          <Badge>New</Badge>
        ) : (
          <span className='text-muted-foreground'>—</span>
        ),
    },
    {
      accessorKey: 'is_published',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) =>
        row.getValue('is_published') ? (
          <Badge className='bg-green-600 text-white hover:bg-green-700'>Published</Badge>
        ) : (
          <Badge variant='outline'>Draft</Badge>
        ),
      filterFn: (row, id, value: string[]) => value.includes(String(row.getValue(id))),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Pencil className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(row.original)}
              className='text-destructive focus:text-destructive'
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}
