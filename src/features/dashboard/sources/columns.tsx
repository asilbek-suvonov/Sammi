import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from '@radix-ui/react-icons'

import { type Column } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type DataTableColumnHeaderProps<TData, TValue> =
  React.HTMLAttributes<HTMLDivElement> & {
    column: Column<TData, TValue>
    title: string
  }

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { t } = useTranslation()

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div
      className={cn(
        'flex items-center space-x-2',
        className
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 data-[state=open]:bg-accent'
          >
            <span>{title}</span>

            {column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className='ms-2 h-4 w-4' />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className='ms-2 h-4 w-4' />
            ) : (
              <CaretSortIcon className='ms-2 h-4 w-4' />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='start'>
          <DropdownMenuItem
            onClick={() =>
              column.toggleSorting(false)
            }
          >
            <ArrowUpIcon className='size-3.5 text-muted-foreground/70' />
            {t('asc')}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              column.toggleSorting(true)
            }
          >
            <ArrowDownIcon className='size-3.5 text-muted-foreground/70' />
            {t('desc')}
          </DropdownMenuItem>

          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  column.toggleVisibility(false)
                }
              >
                <EyeNoneIcon className='size-3.5 text-muted-foreground/70' />
                {t('hide')}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

import { ColumnDef } from '@tanstack/react-table'
import type { SourceCode } from '@/service/sources/sources.type'

interface GetColumnsProps {
  onEdit: (s: SourceCode) => void
  onDelete: (s: SourceCode) => void
}

export const getSourcesColumns = ({ onEdit, onDelete }: GetColumnsProps): ColumnDef<SourceCode>[] => [
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => <span className="max-w-[200px] truncate font-medium">{row.getValue('title')}</span>,
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Slug" />,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.getValue('created_at')}</span>,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button onClick={(e) => { e.stopPropagation(); onEdit(row.original); }} className="text-sm text-blue-600 hover:underline">Edit</button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(row.original); }} className="text-sm text-red-600 hover:underline">Delete</button>
      </div>
    ),
  },
]