/* eslint-disable react-refresh/only-export-components */
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdminStore } from '@/stores/admin-store'
import { useAuthStore } from '@/stores/auth-store'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Briefcase, Clock3, Layers3, Plus, Users } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/dashboard/projects')({
  component: ProjectsPage,
})

function ProjectsPage() {
  const { auth } = useAuthStore()
  const isAdmin = auth.user?.role === 'admin'

  return isAdmin ? <AdminProjectsView /> : <UserProjectsView />
}

function AdminProjectsView() {
  const { projects } = useAdminStore()

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='flex flex-1 flex-col gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Projects</h2>
            <p className='text-muted-foreground'>
              Manage all projects and their source code.
            </p>
          </div>
          <Button size='sm' className='gap-2'>
            <Plus className='size-4' /> Add Project
          </Button>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {projects.map((project) => (
            <Card
              key={project.id}
              className='group overflow-hidden gap-0 p-0 transition-shadow hover:shadow-md'
            >
              <div className='relative overflow-hidden'>
                <img
                  src={project.image}
                  alt={project.title}
                  className='h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]'
                />
                <span className='absolute right-2.5 top-2.5 rounded-md border border-white/20 bg-black/50 px-2 py-0.5 text-[11px] text-white backdrop-blur'>
                  {project.type}
                </span>
              </div>

              <CardHeader className='px-4 pt-4 pb-2'>
                <CardTitle className='text-sm font-semibold'>{project.title}</CardTitle>
              </CardHeader>

              <CardContent className='space-y-3 px-4 pb-4'>
                <div className='flex flex-wrap gap-1.5'>
                  {project.tech.map((t) => (
                    <Badge key={t} variant='secondary' className='text-[11px]'>
                      {t}
                    </Badge>
                  ))}
                </div>
                <div className='flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground'>
                  <span className='flex items-center gap-1'>
                    <Layers3 className='size-3' /> {project.modules} modules
                  </span>
                  <span className='flex items-center gap-1'>
                    <Clock3 className='size-3' /> {project.duration}
                  </span>
                  <span className='flex items-center gap-1'>
                    <Users className='size-3' /> {project.students.toLocaleString()}
                  </span>
                </div>
                <div className='flex items-center justify-between border-t pt-3'>
                  <span className='text-sm font-bold'>{project.price}</span>
                  <div className='flex gap-2'>
                    <Button variant='outline' size='sm' className='h-7 text-xs' asChild>
                      <Link to='/project/$id' params={{ id: project.id }}>View</Link>
                    </Button>
                    <Button size='sm' className='h-7 text-xs'>Edit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Main>
    </>
  )
}

function UserProjectsView() {
  const { projects } = useAdminStore()

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='flex flex-1 flex-col gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Projects</h2>
          <p className='text-muted-foreground'>Explore available projects to build.</p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {projects.map((project) => (
            <Card
              key={project.id}
              className='group overflow-hidden gap-0 p-0 transition-shadow hover:shadow-md cursor-pointer'
            >
              <div className='relative overflow-hidden'>
                <img
                  src={project.image}
                  alt={project.title}
                  className='h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]'
                />
                <span className='absolute right-2.5 top-2.5 rounded-md border border-white/20 bg-black/50 px-2 py-0.5 text-[11px] text-white backdrop-blur'>
                  {project.type}
                </span>
              </div>
              <CardHeader className='px-4 pt-4 pb-2'>
                <CardTitle className='text-sm font-semibold'>{project.title}</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 px-4 pb-4'>
                <div className='flex flex-wrap gap-1.5'>
                  {project.tech.map((t) => (
                    <Badge key={t} variant='secondary' className='text-[11px]'>
                      {t}
                    </Badge>
                  ))}
                </div>
                <div className='flex items-center justify-between border-t pt-3'>
                  <span className='text-sm font-bold'>{project.price}</span>
                  <Button variant='outline' size='sm' className='h-7 text-xs gap-1' asChild>
                    <Link to='/project/$id' params={{ id: project.id }}>
                      <Briefcase className='size-3' /> View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Main>
    </>
  )
}
