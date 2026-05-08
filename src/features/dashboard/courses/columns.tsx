import { type ColumnDef } from '@tanstack/react-table'
import { CheckCircle2, ImageIcon, XCircle } from 'lucide-react'

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

const levelVariantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  beginner: 'secondary',
  intermediate: 'default',
  advanced: 'destructive',
}

export function getCoursesColumns({ onEdit, onDelete }: CoursesColumnsProps): ColumnDef<Course>[] {
  return [
    selectColumn<Course>(),

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
        <div className='ml-2 max-w-[320px]'>
          <span className='block truncate font-medium'>{row.getValue('title')}</span>
        </div>
      ),
    },

    {
      accessorKey: 'level',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Level' />,
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
      accessorKey: 'is_published',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Published' />,
      cell: ({ row }) =>
        row.getValue('is_published') ? (
          <CheckCircle2 className='size-4 text-emerald-500' />
        ) : (
          <XCircle className='size-4 text-muted-foreground' />
        ),
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
