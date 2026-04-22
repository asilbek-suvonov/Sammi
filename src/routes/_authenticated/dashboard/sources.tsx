/* eslint-disable react-refresh/only-export-components */
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink, FolderGit2, GitBranch, Star } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/dashboard/sources')({
  component: SourcesPage,
})

const sources = [
  {
    id: '1',
    title: 'Landing Repository',
    description: 'Responsive landing page source code with full dark mode support',
    href: 'https://github.com',
    stars: 214,
    forks: 48,
    language: 'TypeScript',
    updated: '2 days ago',
    tags: ['React', 'Tailwind', 'Vite'],
  },
  {
    id: '2',
    title: 'Dashboard Repository',
    description: 'Admin panel with role-based access control and data tables',
    href: 'https://github.com',
    stars: 389,
    forks: 92,
    language: 'TypeScript',
    updated: '1 day ago',
    tags: ['React', 'TanStack', 'Zustand'],
  },
  {
    id: '3',
    title: 'UI Components Repository',
    description: 'Shared shadcn/ui component library with custom extensions',
    href: 'https://github.com',
    stars: 157,
    forks: 33,
    language: 'TypeScript',
    updated: '5 days ago',
    tags: ['Radix UI', 'Tailwind', 'shadcn'],
  },
  {
    id: '4',
    title: 'Course Preview Player',
    description: 'Video player component with progress tracking and playlist',
    href: 'https://github.com',
    stars: 98,
    forks: 21,
    language: 'TypeScript',
    updated: '1 week ago',
    tags: ['React', 'Video.js', 'Zustand'],
  },
  {
    id: '5',
    title: 'Auth Boilerplate',
    description: 'Email + OTP authentication flow with session management',
    href: 'https://github.com',
    stars: 203,
    forks: 57,
    language: 'TypeScript',
    updated: '3 days ago',
    tags: ['React Hook Form', 'Zod', 'JWT'],
  },
  {
    id: '6',
    title: 'Data Table Kit',
    description: 'Advanced data table with sorting, filtering, and pagination',
    href: 'https://github.com',
    stars: 312,
    forks: 74,
    language: 'TypeScript',
    updated: '4 days ago',
    tags: ['TanStack Table', 'React Query', 'Tailwind'],
  },
]

function SourcesPage() {
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
            <h2 className='text-2xl font-bold tracking-tight'>Sources</h2>
            <p className='text-muted-foreground'>
              Manage code repositories and source files.
            </p>
          </div>
          <Button size='sm' className='gap-2'>
            <FolderGit2 className='size-4' /> Add Repository
          </Button>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {sources.map((source) => (
            <Card key={source.id} className='flex flex-col transition-shadow hover:shadow-md'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-start gap-2 text-sm font-semibold'>
                  <FolderGit2 className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
                  {source.title}
                </CardTitle>
                <p className='text-xs text-muted-foreground leading-relaxed'>
                  {source.description}
                </p>
              </CardHeader>
              <CardContent className='mt-auto space-y-3 pt-0'>
                <div className='flex flex-wrap gap-1.5'>
                  {source.tags.map((tag) => (
                    <Badge key={tag} variant='secondary' className='text-[11px]'>
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className='flex items-center justify-between border-t pt-3'>
                  <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                    <span className='flex items-center gap-1'>
                      <Star className='size-3 fill-amber-400 text-amber-400' />
                      {source.stars}
                    </span>
                    <span className='flex items-center gap-1'>
                      <GitBranch className='size-3' />
                      {source.forks}
                    </span>
                    <span className='text-[11px]'>{source.updated}</span>
                  </div>
                  <a
                    href={source.href}
                    target='_blank'
                    rel='noreferrer'
                    className='flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground'
                  >
                    GitHub <ExternalLink className='size-3' />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Main>
    </>
  )
}
