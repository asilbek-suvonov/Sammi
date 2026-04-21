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
import { Pencil, PlusCircle, Trash2, Upload } from 'lucide-react'
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

type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced'
type CourseStatus = 'active' | 'draft'

interface Course {
  id: string
  title: string
  description: string
  imagePreview: string
  level: CourseLevel
  category: string
  price: string
  hours: number
  students: number
  status: CourseStatus
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const initialCourses: Course[] = [
  { id: '1', title: 'Frontend Foundations', description: 'HTML, CSS, JS asoslari', imagePreview: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400', level: 'Beginner', category: 'Frontend', price: '$149', hours: 36, students: 1240, status: 'active' },
  { id: '2', title: 'TypeScript Mastery', description: 'TypeScript chuqur o\'rganish', imagePreview: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=400', level: 'Intermediate', category: 'Frontend', price: '$129', hours: 28, students: 980, status: 'active' },
  { id: '3', title: 'React Performance', description: 'React ilovalarini optimizatsiya qilish', imagePreview: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=400', level: 'Advanced', category: 'Frontend', price: '$119', hours: 24, students: 750, status: 'draft' },
  { id: '4', title: 'Next.js Full-Stack', description: 'Next.js bilan to\'liq stack dasturlash', imagePreview: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=400', level: 'Intermediate', category: 'Full-Stack', price: '$169', hours: 42, students: 1540, status: 'active' },
  { id: '5', title: 'TanStack Ecosystem', description: 'TanStack Router, Query, Table', imagePreview: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=400', level: 'Advanced', category: 'Frontend', price: '$99', hours: 20, students: 620, status: 'active' },
  { id: '6', title: 'UI Design Systems', description: 'Dizayn tizimlarini yaratish', imagePreview: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=400', level: 'Intermediate', category: 'Design', price: '$139', hours: 32, students: 890, status: 'draft' },
]

const levelOptions = [
  { label: 'Boshlang\'ich', value: 'Beginner' },
  { label: 'O\'rta', value: 'Intermediate' },
  { label: 'Ilg\'or', value: 'Advanced' },
]

const statusOptions = [
  { label: 'Faol', value: 'active' },
  { label: 'Qoralama', value: 'draft' },
]

const categoryOptions = ['Frontend', 'Backend', 'Full-Stack', 'Design', 'DevOps', 'Mobile']

const emptyForm: Omit<Course, 'id' | 'students'> = {
  title: '',
  description: '',
  imagePreview: '',
  level: 'Beginner',
  category: 'Frontend',
  price: '',
  hours: 0,
  status: 'active',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const fileRef = useRef<HTMLInputElement>(null)

  // ─── Columns ────────────────────────────────────────────────────────────────
  const columns: ColumnDef<Course>[] = [
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
      header: ({ column }) => <DataTableColumnHeader column={column} title='Sarlavha' />,
      cell: ({ row }) => <span className='font-medium'>{row.getValue('title')}</span>,
    },
    {
      accessorKey: 'level',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Daraja' />,
      cell: ({ row }) => {
        const level = row.getValue('level') as CourseLevel
        return (
          <Badge variant={level === 'Beginner' ? 'secondary' : level === 'Advanced' ? 'destructive' : 'outline'}>
            {level}
          </Badge>
        )
      },
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'category',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Kategoriya' />,
      cell: ({ row }) => <span className='text-muted-foreground'>{row.getValue('category')}</span>,
    },
    {
      accessorKey: 'price',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Narx' />,
      cell: ({ row }) => <span className='font-medium'>{row.getValue('price')}</span>,
    },
    {
      accessorKey: 'hours',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Soat' />,
      cell: ({ row }) => <span>{row.getValue<number>('hours')}s</span>,
    },
    {
      accessorKey: 'students',
      header: ({ column }) => <DataTableColumnHeader column={column} title="O'quvchilar" />,
      cell: ({ row }) => <span>{row.getValue<number>('students').toLocaleString()}</span>,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Holat' />,
      cell: ({ row }) => {
        const status = row.getValue('status') as CourseStatus
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
        const course = row.original
        return (
          <div className='flex gap-1'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' className='size-8' onClick={() => openEdit(course)}>
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
                  onClick={() => handleDelete(course.id)}
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
    data: courses,
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

  function openEdit(course: Course) {
    setEditingId(course.id)
    setForm({
      title: course.title,
      description: course.description,
      imagePreview: course.imagePreview,
      level: course.level,
      category: course.category,
      price: course.price,
      hours: course.hours,
      status: course.status,
    })
    setSheetOpen(true)
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setForm((prev) => ({ ...prev, imagePreview: url }))
  }

  function handleSave() {
    if (!form.title.trim()) {
      toast.error('Sarlavha majburiy')
      return
    }
    if (editingId) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editingId ? { ...c, ...form } : c
        )
      )
      toast.success('Kurs yangilandi')
    } else {
      const newCourse: Course = {
        ...form,
        id: Date.now().toString(),
        students: 0,
      }
      setCourses((prev) => [newCourse, ...prev])
      toast.success('Yangi kurs qo\'shildi')
    }
    setSheetOpen(false)
  }

  function handleDelete(id: string) {
    setCourses((prev) => prev.filter((c) => c.id !== id))
    toast.success('Kurs o\'chirildi')
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
          <h2 className='text-2xl font-bold tracking-tight'>Kurslar boshqaruvi</h2>
          <p className='text-muted-foreground'>Barcha kurslarni boshqaring.</p>
        </div>

        {/* Toolbar */}
        <div className='flex items-center gap-2 flex-wrap'>
          <div className='flex flex-1 flex-wrap items-center gap-2'>
            <Input
              placeholder='Kurs qidirish...'
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className='h-8 w-[180px]'
            />
            <DataTableFacetedFilter
              column={table.getColumn('level')}
              title='Daraja'
              options={levelOptions}
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
                onClick={() => {
                  setColumnFilters([])
                  setGlobalFilter('')
                }}
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
                  Kurs qo'shish
                </Button>
              </TooltipTrigger>
              <TooltipContent>Yangi kurs qo'shish</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Table */}
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
                    Kurs topilmadi.
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
            <SheetTitle>{editingId ? 'Kursni tahrirlash' : 'Yangi kurs qo\'shish'}</SheetTitle>
            <SheetDescription>
              {editingId ? 'Kurs ma\'lumotlarini yangilang.' : 'Yangi kurs uchun ma\'lumotlarni to\'ldiring.'}
            </SheetDescription>
          </SheetHeader>

          <div className='flex-1 overflow-y-auto space-y-4 px-6 py-4'>
            {/* Image upload */}
            <div className='space-y-2'>
              <Label>Kurs rasmi</Label>
              <div
                onClick={() => fileRef.current?.click()}
                className='cursor-pointer overflow-hidden rounded-md border-2 border-dashed border-muted-foreground/25 transition hover:border-muted-foreground/50'
              >
                {form.imagePreview ? (
                  <img
                    src={form.imagePreview}
                    alt='preview'
                    className='h-36 w-full object-cover'
                  />
                ) : (
                  <div className='flex flex-col items-center gap-2 py-8'>
                    <Upload className='size-8 text-muted-foreground' />
                    <p className='text-sm text-muted-foreground'>Rasm yuklash uchun bosing</p>
                    <p className='text-xs text-muted-foreground'>PNG, JPG, WEBP (max 5MB)</p>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleImageChange}
              />
              {form.imagePreview && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-7 text-xs text-muted-foreground'
                  onClick={() => setForm((p) => ({ ...p, imagePreview: '' }))}
                >
                  Rasmni olib tashlash
                </Button>
              )}
            </div>

            {/* Title */}
            <div className='space-y-2'>
              <Label htmlFor='course-title'>Sarlavha *</Label>
              <Input
                id='course-title'
                placeholder='Kurs nomi'
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              />
            </div>

            {/* Description */}
            <div className='space-y-2'>
              <Label htmlFor='course-desc'>Tavsif</Label>
              <Textarea
                id='course-desc'
                placeholder='Kurs haqida qisqacha...'
                rows={3}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </div>

            {/* Level & Category */}
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <Label>Daraja</Label>
                <Select
                  value={form.level}
                  onValueChange={(v) => setForm((p) => ({ ...p, level: v as CourseLevel }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Beginner'>Boshlang'ich</SelectItem>
                    <SelectItem value='Intermediate'>O'rta</SelectItem>
                    <SelectItem value='Advanced'>Ilg'or</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>Kategoriya</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price & Hours */}
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <Label htmlFor='course-price'>Narx</Label>
                <Input
                  id='course-price'
                  placeholder='$99'
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='course-hours'>Davomiyligi (soat)</Label>
                <Input
                  id='course-hours'
                  type='number'
                  min={0}
                  placeholder='24'
                  value={form.hours || ''}
                  onChange={(e) => setForm((p) => ({ ...p, hours: Number(e.target.value) }))}
                />
              </div>
            </div>

            {/* Status */}
            <div className='flex items-center justify-between rounded-lg border p-3'>
              <div>
                <p className='text-sm font-medium'>Faol holat</p>
                <p className='text-xs text-muted-foreground'>Kursni foydalanuvchilarga ko'rsatish</p>
              </div>
              <Switch
                checked={form.status === 'active'}
                onCheckedChange={(checked) =>
                  setForm((p) => ({ ...p, status: checked ? 'active' : 'draft' }))
                }
              />
            </div>
          </div>

          <SheetFooter className='border-t px-6 py-4'>
            <Button variant='outline' onClick={() => setSheetOpen(false)}>
              Bekor qilish
            </Button>
            <Button onClick={handleSave}>
              {editingId ? 'Yangilash' : 'Saqlash'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
