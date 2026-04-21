import { useState } from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Cross2Icon } from '@radix-ui/react-icons'
import { ExternalLink, Pencil, PlusCircle, Star, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { DataTablePagination } from '@/components/data-table/pagination'
import { DataTableViewOptions } from '@/components/data-table/view-options'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Source {
  id: string
  title: string
  description: string
  url: string
  stars: number
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const initialSources: Source[] = [
  { id: '1', title: 'Landing Repository', description: 'Responsive landing page source code', url: 'https://github.com/sammi/landing', stars: 214 },
  { id: '2', title: 'Dashboard Repository', description: 'Admin panel with role-based access', url: 'https://github.com/sammi/dashboard', stars: 389 },
  { id: '3', title: 'UI Components Repository', description: 'Shared shadcn/ui component library', url: 'https://github.com/sammi/ui', stars: 157 },
]

const emptyForm = { title: '', description: '', url: '', stars: 0 }

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminSources() {
  const [sources, setSources] = useState<Source[]>(initialSources)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  // ─── Columns ────────────────────────────────────────────────────────────────
  const columns: ColumnDef<Source>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Sarlavha' />,
      cell: ({ row }) => <span className='font-medium'>{row.getValue('title')}</span>,
    },
    {
      accessorKey: 'description',
      header: 'Tavsif',
      enableSorting: false,
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground line-clamp-1'>
          {row.getValue('description')}
        </span>
      ),
    },
    {
      accessorKey: 'url',
      header: 'URL',
      enableSorting: false,
      cell: ({ row }) => {
        const url = row.getValue<string>('url')
        return (
          <a
            href={url}
            target='_blank'
            rel='noreferrer'
            className='flex max-w-[200px] items-center gap-1 truncate text-sm text-blue-500 hover:underline'
          >
            {url}
            <ExternalLink className='size-3 shrink-0' />
          </a>
        )
      },
    },
    {
      accessorKey: 'stars',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Yulduzlar' />,
      cell: ({ row }) => (
        <span className='flex items-center gap-1'>
          <Star className='size-3.5 fill-amber-400 text-amber-400' />
          {row.getValue<number>('stars').toLocaleString()}
        </span>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const source = row.original
        return (
          <div className='flex gap-1'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' className='size-8' onClick={() => openEdit(source)}>
                  <Pencil className='size-3.5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tahrirlash</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='size-8 text-destructive hover:text-destructive'
                  onClick={() => handleDelete(source.id)}
                >
                  <Trash2 className='size-3.5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>O'chirish</TooltipContent>
            </Tooltip>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: sources,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const isFiltered = columnFilters.length > 0 || !!globalFilter

  // ─── Handlers ───────────────────────────────────────────────────────────────

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(source: Source) {
    setEditingId(source.id)
    setForm({ title: source.title, description: source.description, url: source.url, stars: source.stars })
    setDialogOpen(true)
  }

  function handleSave() {
    if (!form.title.trim()) { toast.error('Sarlavha majburiy'); return }
    if (!form.url.trim()) { toast.error('URL majburiy'); return }
    if (editingId) {
      setSources((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...form } : s)))
      toast.success('Manba yangilandi')
    } else {
      setSources((prev) => [{ ...form, id: Date.now().toString() }, ...prev])
      toast.success('Yangi manba qo\'shildi')
    }
    setDialogOpen(false)
  }

  function handleDelete(id: string) {
    setSources((prev) => prev.filter((s) => s.id !== id))
    toast.success('Manba o\'chirildi')
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Manbalar boshqaruvi</h2>
          <p className='text-muted-foreground'>GitHub repozitoriyalarini boshqaring.</p>
        </div>

        {/* Toolbar */}
        <div className='flex flex-wrap items-center gap-2'>
          <div className='flex flex-1 flex-wrap items-center gap-2'>
            <Input
              placeholder='Manba qidirish...'
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className='h-8 w-[200px]'
            />
            {isFiltered && (
              <Button
                variant='ghost'
                size='sm'
                className='h-8 px-2'
                onClick={() => { setColumnFilters([]); setGlobalFilter('') }}
              >
                Reset <Cross2Icon className='ms-1 size-3.5' />
              </Button>
            )}
          </div>
          <div className='flex items-center gap-2'>
            <DataTableViewOptions table={table} />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size='sm' className='h-8 gap-1.5' onClick={openAdd}>
                  <PlusCircle className='size-4' />
                  Manba qo'shish
                </Button>
              </TooltipTrigger>
              <TooltipContent>Yangi manba qo'shish</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Table */}
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableHead key={h.id}>
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center text-muted-foreground'>
                    Manba topilmadi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DataTablePagination table={table} />
      </Main>

      {/* ─── Dialog ─────────────────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Manbani tahrirlash' : "Yangi manba qo'shish"}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Manba ma\'lumotlarini yangilang.' : "GitHub repozitoriya ma'lumotlarini kiriting."}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 py-2'>
            <div className='space-y-2'>
              <Label htmlFor='src-title'>Sarlavha *</Label>
              <Input
                id='src-title'
                placeholder='Repozitoriya nomi'
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='src-desc'>Tavsif</Label>
              <Input
                id='src-desc'
                placeholder='Qisqacha tavsif'
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='src-url'>GitHub URL *</Label>
              <Input
                id='src-url'
                placeholder='https://github.com/user/repo'
                value={form.url}
                onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='src-stars'>Yulduzlar soni</Label>
              <Input
                id='src-stars'
                type='number'
                min={0}
                placeholder='0'
                value={form.stars || ''}
                onChange={(e) => setForm((p) => ({ ...p, stars: Number(e.target.value) }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
            <Button onClick={handleSave}>{editingId ? 'Yangilash' : 'Saqlash'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
