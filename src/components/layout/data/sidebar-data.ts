import { Briefcase, Command, FolderGit2, GraduationCap, LayoutDashboard, Users } from 'lucide-react'
import { type SidebarData } from '../types'

type Role = 'admin' | 'user'

export const buildSidebarData = (
  role: Role,
  email: string
): SidebarData => {
  const commonItems: SidebarData['navGroups'][number]['items'] = [
    { title: 'Overview', url: '/dashboard/overview', icon: LayoutDashboard },
    { title: 'Courses', url: '/dashboard/courses', icon: GraduationCap },
    { title: 'Projects', url: '/dashboard/projects', icon: Briefcase },
  ]

  if (role === 'admin') {
    commonItems.push(
      { title: 'Sources', url: '/dashboard/sources', icon: FolderGit2 },
    )
  }

  return {
    user: {
      name: email.split('@')[0] || 'member',
      email,
      avatar: '/avatars/shadcn.jpg',
    },
    teams: [
      {
        name: 'Edu Center',
        logo: Command,
        plan: role === 'admin' ? 'Admin' : 'User',
        homeUrl: role === 'admin' ? '/dashboard/overview' : '/',
      },
    ],
    navGroups: [
      {
        title: 'General',
        items: commonItems,
      },
    ],
  }
}

export const sidebarData: SidebarData = buildSidebarData('user', 'member@sammi.local')
