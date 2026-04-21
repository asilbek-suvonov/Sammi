import { useRef, useState } from 'react'
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
import { Pencil, PlusCircle, Trash2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter'
import { DataTablePagination } from '@/components/data-table/pagination'
import { DataTableViewOptions } from '@/components/data-table/view-options'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectStatus = 'active' | 'draft'

interface Project {
  id: string
  title: string
  description: string
  imagePreview: string
  type: string
  tech: string[]
  members: number
  githubUrl: string
  status: ProjectStatus
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const initialProjects: Project[] = [
  { id: '1', title: 'SaaS Billing Dashboard', description: 'Billing va to\'lov boshqaruv paneli', imagePreview: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=400', type: 'Full-Stack', tech: ['React', 'TanStack Router', 'Tailwind'], members: 8, githubUrl: 'https://github.com', status: 'active' },
  { id: '2', title: 'Design System Starter', description: 'Umumiy UI komponentlar kutubxonasi', imagePreview: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400', type: 'Frontend', tech: ['TypeScript', 'Radix UI', 'Storybook'], members: 5, githubUrl: 'https://github.com', status: 'active' },
  { id: '3', title: 'Analytics Portal', description: 'Ma\'lumotlar tahlil platformasi', imagePreview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400', type: 'Data', tech: ['Recharts', 'React Query', 'Zod'], members: 3, githubUrl: 'https://github.com', status: 'draft' },
  { id: '4', title: 'E-Commerce Platform', description: 'To\'liq savdo platformasi', imagePreview: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=400', type: 'Full-Stack', tech: ['Next.js', 'Stripe', 'Prisma'], members: 12, githubUrl: 'https://github.com', status: 'active' },
  { id: '5', title: 'Real-time Chat App', description: 'Jonli xabar almashish ilovasi', imagePreview: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=400', type: 'Real-time', tech: ['Socket.io', 'Redis', 'React'], members: 6, githubUrl: 'https://github.com', status: 'active' },
  { id: '6', title: 'DevOps Dashboard', description: 'DevOps monitoring paneli', imagePreview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400', type: 'DevOps', tech: ['Grafana API', 'Docker', 'TypeScript'], members: 4, githubUrl: 'https://github.com', status: 'draft' },
]

const typeOptions = [
  { label: 'Full-Stack', value: 'Full-Stack' },
  { label: 'Frontend', value: 'Frontend' },
  { label: 'Data', value: 'Data' },
  { label: 'Real-time', value: 'Real-time' },
  { label: 'DevOps', value: 'DevOps' },
]

const statusOptions = [
  { label: 'Faol', value: 'active' },
  { label: 'Qoralama', value: 'draft' },
]

const projectTypes = ['Full-Stack', 'Frontend', 'Backend', 'Data', 'Real-time', 'DevOps', 'Mobile']

const emptyForm: Omit<Project, 'id' | 'members'> & { techInput: string } = {
  title: '',
  description: '',
  imagePreview: '',
  type: 'Full-Stack',
  tech: [],
  techInput: '',
  githubUrl: '',
  status: 'active',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const fileRef = useRef<HTMLInputElement>(null)

  // ─── Columns ────────────────────────────────────────────────────────────────
  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: 'imagePreview',
      header: 'Rasm',
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <img
          src={row.getValue('imagePreview')}
          alt={row.getValue('title')}
          className='h-10 w-16 rounded object-cover'
        />
      ),
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Loyiha' />,
      cell: ({ row }) => <span className='font-medium'>{row.getValue('title')}</span>,
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Turi' />,
      cell: ({ row }) => <Badge variant='outline'>{row.getValue('type')}</Badge>,
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'tech',
      header: 'Texnologiyalar',
      enableSorting: false,
      cell: ({ row }) => {
        const tech = row.getValue<string[]>('tech')
        return (
          <div className='flex flex-wrap gap-1'>
            {tech.slice(0, 2).map((t) => (
              <Badge key={t} variant='secondary' className='text-[10px]'>{t}</Badge>
            ))}
            {tech.length > 2 && (
              <Badge variant='secondary' className='text-[10px]'>+{tech.length - 2}</Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'members',
      header: ({ column }) => <DataTableColumnHeader column={column} title="A'zolar" />,
      cell: ({ row }) => <span>{row.getValue<number>('members')} kishi</span>,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Holat' />,
      cell: ({ row }) => {
        const status = row.getValue('status') as ProjectStatus
        return (
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status === 'active' ? 'Faol' : 'Qoralama'}
          </Badge>
        )
      },
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const project = row.original
        return (
          <div className='flex gap-1'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' className='size-8' onClick={() => openEdit(project)}>
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
                  onClick={() => handleDelete(project.id)}
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
    data: projects,
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
    setSheetOpen(true)
  }

  function openEdit(project: Project) {
    setEditingId(project.id)
    setForm({
      title: project.title,
      description: project.description,
      imagePreview: project.imagePreview,
      type: project.type,
      tech: project.tech,
      techInput: '',
      githubUrl: project.githubUrl,
      status: project.status,
    })
    setSheetOpen(true)
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setForm((p) => ({ ...p, imagePreview: URL.createObjectURL(file) }))
  }

  function addTech() {
    const tag = form.techInput.trim()
    if (!tag || form.tech.includes(tag)) {
      setForm((p) => ({ ...p, techInput: '' }))
      return
    }
    setForm((p) => ({ ...p, tech: [...p.tech, tag], techInput: '' }))
  }

  function removeTech(tag: string) {
    setForm((p) => ({ ...p, tech: p.tech.filter((t) => t !== tag) }))
  }

  function handleSave() {
    if (!form.title.trim()) {
      toast.error('Sarlavha majburiy')
      return
    }
    if (editingId) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...form } : p))
      )
      toast.success('Loyiha yangilandi')
    } else {
      setProjects((prev) => [
        { ...form, id: Date.now().toString(), members: 0 },
        ...prev,
      ])
      toast.success('Yangi loyiha qo\'shildi')
    }
    setSheetOpen(false)
  }

  function handleDelete(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    toast.success('Loyiha o\'chirildi')
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
          <h2 className='text-2xl font-bold tracking-tight'>Loyihalar boshqaruvi</h2>
          <p className='text-muted-foreground'>Barcha loyihalarni boshqaring.</p>
        </div>

        {/* Toolbar */}
        <div className='flex flex-wrap items-center gap-2'>
          <div className='flex flex-1 flex-wrap items-center gap-2'>
            <Input
              placeholder='Loyiha qidirish...'
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className='h-8 w-[180px]'
            />
            <DataTableFacetedFilter
              column={table.getColumn('type')}
              title='Turi'
              options={typeOptions}
            />
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Holat'
              options={statusOptions}
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
                  Loyiha qo'shish
                </Button>
              </TooltipTrigger>
              <TooltipContent>Yangi loyiha qo'shish</TooltipContent>
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
                    Loyiha topilmadi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DataTablePagination table={table} />
      </Main>

      {/* ─── Sheet ──────────────────────────────────────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className='flex flex-col p-0 sm:max-w-md'>
          <SheetHeader className='border-b px-6 py-4'>
            <SheetTitle>{editingId ? 'Loyihani tahrirlash' : "Yangi loyiha qo'shish"}</SheetTitle>
            <SheetDescription>
              {editingId ? 'Loyiha ma\'lumotlarini yangilang.' : "Yangi loyiha uchun ma'lumotlarni to'ldiring."}
            </SheetDescription>
          </SheetHeader>

          <div className='flex-1 overflow-y-auto space-y-4 px-6 py-4'>
            {/* Image upload */}
            <div className='space-y-2'>
              <Label>Loyiha rasmi</Label>
              <div
                onClick={() => fileRef.current?.click()}
                className='cursor-pointer overflow-hidden rounded-md border-2 border-dashed border-muted-foreground/25 transition hover:border-muted-foreground/50'
              >
                {form.imagePreview ? (
                  <img src={form.imagePreview} alt='preview' className='h-36 w-full object-cover' />
                ) : (
                  <div className='flex flex-col items-center gap-2 py-8'>
                    <Upload className='size-8 text-muted-foreground' />
                    <p className='text-sm text-muted-foreground'>Rasm yuklash uchun bosing</p>
                    <p className='text-xs text-muted-foreground'>PNG, JPG, WEBP (max 5MB)</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
              {form.imagePreview && (
                <Button variant='ghost' size='sm' className='h-7 text-xs text-muted-foreground' onClick={() => setForm((p) => ({ ...p, imagePreview: '' }))}>
                  Rasmni olib tashlash
                </Button>
              )}
            </div>

            {/* Title */}
            <div className='space-y-2'>
              <Label htmlFor='proj-title'>Sarlavha *</Label>
              <Input id='proj-title' placeholder='Loyiha nomi' value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            </div>

            {/* Description */}
            <div className='space-y-2'>
              <Label htmlFor='proj-desc'>Tavsif</Label>
              <Textarea id='proj-desc' placeholder='Loyiha haqida...' rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            </div>

            {/* Type */}
            <div className='space-y-2'>
              <Label>Loyiha turi</Label>
              <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {projectTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Tech stack */}
            <div className='space-y-2'>
              <Label>Texnologiyalar</Label>
              <div className='flex gap-2'>
                <Input
                  placeholder='React, Node.js...'
                  value={form.techInput}
                  onChange={(e) => setForm((p) => ({ ...p, techInput: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                />
                <Button type='button' variant='outline' size='sm' onClick={addTech}>
                  Qo'sh
                </Button>
              </div>
              {form.tech.length > 0 && (
                <div className='flex flex-wrap gap-1.5'>
                  {form.tech.map((tag) => (
                    <Badge key={tag} variant='secondary' className='gap-1'>
                      {tag}
                      <button onClick={() => removeTech(tag)} className='ml-0.5 hover:text-destructive'>
                        <X className='size-2.5' />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* GitHub URL */}
            <div className='space-y-2'>
              <Label htmlFor='proj-github'>GitHub URL</Label>
              <Input id='proj-github' placeholder='https://github.com/...' value={form.githubUrl} onChange={(e) => setForm((p) => ({ ...p, githubUrl: e.target.value }))} />
            </div>

            {/* Status */}
            <div className='flex items-center justify-between rounded-lg border p-3'>
              <div>
                <p className='text-sm font-medium'>Faol holat</p>
                <p className='text-xs text-muted-foreground'>Loyihani foydalanuvchilarga ko'rsatish</p>
              </div>
              <Switch
                checked={form.status === 'active'}
                onCheckedChange={(checked) => setForm((p) => ({ ...p, status: checked ? 'active' : 'draft' }))}
              />
            </div>
          </div>

          <SheetFooter className='border-t px-6 py-4'>
            <Button variant='outline' onClick={() => setSheetOpen(false)}>Bekor qilish</Button>
            <Button onClick={handleSave}>{editingId ? 'Yangilash' : 'Saqlash'}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
