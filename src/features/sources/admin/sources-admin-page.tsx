import { useState } from 'react'
import { Plus, Pencil, Trash2, ExternalLink, Github, Search } from 'lucide-react'
import {
  useSources,
  useDeleteSource,
  useCreateSource,
  useUpdateSource,
} from '@/api-hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import type { SourceCode, SourceCodeCreateUpdate } from '@/service/sources/sources.type'

export function SourcesAdminPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingSource, setEditingSource] = useState<SourceCode | null>(null)
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)

  // Queries & Mutations
  const { data, isLoading } = useSources({ page, search })
  const { mutate: createSource, isPending: isCreating } = useCreateSource()
  const { mutate: updateSource, isPending: isUpdating } = useUpdateSource()
  const { mutate: deleteSource, isPending: isDeleting } = useDeleteSource()

  // Form state
  const [formData, setFormData] = useState<SourceCodeCreateUpdate>({
    title: '',
    github_url: '',
  })

  const handleCreate = () => {
    createSource(formData, {
      onSuccess: () => {
        setIsCreateOpen(false)
        setFormData({ title: '', github_url: '' })
      },
    })
  }

  const handleUpdate = () => {
    if (!editingSource) return
    updateSource(
      { slug: editingSource.slug, data: formData },
      {
        onSuccess: () => {
          setEditingSource(null)
          setFormData({ title: '', github_url: '' })
        },
      }
    )
  }

  const handleDelete = () => {
    if (!deletingSlug) return
    deleteSource(deletingSlug, {
      onSuccess: () => setDeletingSlug(null),
    })
  }

  const openEdit = (source: SourceCode) => {
    setEditingSource(source)
    setFormData({ title: source.title, github_url: source.github_url })
  }

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Source Codes</h1>
          <p className='text-muted-foreground'>Manage source code repositories for your students</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Add Source Code
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex gap-2'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='Search by title...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-9'
              />
            </div>
            <Button variant='secondary' onClick={() => setPage(1)}>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sources Table */}
      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>GitHub URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className='text-center py-8'>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data?.results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
                    No source codes found
                  </TableCell>
                </TableRow>
              ) : (
                data?.results.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell className='font-medium'>{source.title}</TableCell>
                    <TableCell className='text-muted-foreground'>{source.slug}</TableCell>
                    <TableCell>
                      <a
                        href={source.github_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-1 text-blue-500 hover:underline'
                      >
                        <Github className='h-4 w-4' />
                        View
                        <ExternalLink className='h-3 w-3' />
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant={source.is_published ? 'default' : 'secondary'}>
                        {source.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {new Date(source.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        <Button variant='ghost' size='sm' onClick={() => openEdit(source)}>
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setDeletingSlug(source.slug)}
                        >
                          <Trash2 className='h-4 w-4 text-destructive' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {data && data.count > 10 && (
            <div className='flex items-center justify-between px-4 py-4 border-t'>
              <p className='text-sm text-muted-foreground'>
                Showing {(page - 1) * 10 + 1} - {Math.min(page * 10, data.count)} of {data.count}
              </p>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!data.previous}
                >
                  Previous
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!data.next}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Source Code</DialogTitle>
            <DialogDescription>
              Add a new GitHub repository for students to access
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                placeholder='e.g., React Hooks Examples'
                value={formData.title}
                onChange={(e) => setFormData((d) => ({ ...d, title: e.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='github_url'>GitHub URL</Label>
              <Input
                id='github_url'
                placeholder='https://github.com/username/repo'
                value={formData.github_url}
                onChange={(e) => setFormData((d) => ({ ...d, github_url: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingSource} onOpenChange={() => setEditingSource(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Source Code</DialogTitle>
            <DialogDescription>Update the source code details</DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='edit-title'>Title</Label>
              <Input
                id='edit-title'
                value={formData.title}
                onChange={(e) => setFormData((d) => ({ ...d, title: e.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-github_url'>GitHub URL</Label>
              <Input
                id='edit-github_url'
                value={formData.github_url}
                onChange={(e) => setFormData((d) => ({ ...d, github_url: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setEditingSource(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={!!deletingSlug} onOpenChange={() => setDeletingSlug(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the source code. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingSlug(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default SourcesAdminPage
