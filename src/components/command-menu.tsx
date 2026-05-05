import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { BookOpen, Briefcase, Laptop, Moon, Sun } from 'lucide-react'
import { useSearch } from '@/context/search-provider'
import { useTheme } from '@/context/theme-provider'
import { useCourses } from '@/api-hooks/course/use-courses'
import { useProjects } from '@/api-hooks/projects/use-projects'
import { useAuthUser } from '@/stores/selectors'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { buildSidebarData } from './layout/data/sidebar-data'
import { ScrollArea } from './ui/scroll-area'

export function CommandMenu() {
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()
  const user = useAuthUser()
  const { data: courses = [] } = useCourses()
  const { data: projectData } = useProjects()
  const projects = projectData?.results ?? []
  const role = user?.role ?? 'user'
  const email = user?.email ?? 'member@sammi.local'
  const sidebarData = buildSidebarData(role, email)

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Search courses, projects, pages...' />
      <CommandList>
        <ScrollArea type='hover' className='h-80 pe-1'>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Navigation */}
          {sidebarData.navGroups.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem, i) => {
                if (navItem.url)
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={`nav-${navItem.title}`}
                      onSelect={() => runCommand(() => navigate({ to: navItem.url }))}
                    >
                      {navItem.icon && React.createElement(navItem.icon, { className: 'size-4' })}
                      {navItem.title}
                    </CommandItem>
                  )

                return navItem.items?.map((subItem, j) => (
                  <CommandItem
                    key={`${navItem.title}-${subItem.url}-${j}`}
                    value={`nav-${navItem.title}-${subItem.title}`}
                    onSelect={() => runCommand(() => navigate({ to: subItem.url }))}
                  >
                    {navItem.title} › {subItem.title}
                  </CommandItem>
                ))
              })}
            </CommandGroup>
          ))}

          <CommandSeparator />

          {/* Courses */}
          <CommandGroup heading='Courses'>
            {courses.map((course) => (
              <CommandItem
                key={course.id}
                value={`course-${course.title}-${course.category_name}-${course.level}`}
                onSelect={() =>
                  runCommand(() =>
                    navigate({ to: '/course/$id', params: { id: String(course.id) } })
                  )
                }
              >
                <BookOpen className='size-4 shrink-0 text-muted-foreground' />
                <div className='flex flex-col'>
                  <span className='text-sm'>{course.title}</span>
                  <span className='text-xs text-muted-foreground'>
                    {course.level} · {course.is_free ? 'Free' : course.price}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          {/* Projects */}
          <CommandGroup heading='Projects'>
            {projects.map((project) => (
              <CommandItem
                key={project.id}
                value={`project-${project.title}-${project.difficulty}-${project.technologies.map((t) => t.name).join(' ')}`}
                onSelect={() =>
                  runCommand(() =>
                    navigate({ to: '/project/$id', params: { id: String(project.id) } })
                  )
                }
              >
                <Briefcase className='size-4 shrink-0 text-muted-foreground' />
                <div className='flex flex-col'>
                  <span className='text-sm'>{project.title}</span>
                  <span className='text-xs text-muted-foreground'>
                    {project.difficulty_display || project.difficulty} · {project.total_duration_str}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          {/* Theme */}
          <CommandGroup heading='Theme'>
            <CommandItem
              value='theme-light'
              onSelect={() => runCommand(() => setTheme('light'))}
            >
              <Sun className='size-4' /> Light
            </CommandItem>
            <CommandItem
              value='theme-dark'
              onSelect={() => runCommand(() => setTheme('dark'))}
            >
              <Moon className='size-4' /> Dark
            </CommandItem>
            <CommandItem
              value='theme-system'
              onSelect={() => runCommand(() => setTheme('system'))}
            >
              <Laptop className='size-4' /> System
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
