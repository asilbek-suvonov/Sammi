import { BookOpen, Briefcase, FolderGit2, GraduationCap, LayoutDashboard } from 'lucide-react'
import { EduLogoIcon } from '@/assets/edu-logo-icon'
import { type SidebarData } from '../types'

type Role = 'admin' | 'user'

export const buildSidebarData = (role: Role, email: string): SidebarData => {
  const adminItems: SidebarData['navGroups'][number]['items'] = [
    { title: 'Dashboard', url: '/dashboard/overview', icon: LayoutDashboard },
    { title: 'Courses', url: '/dashboard/courses', icon: GraduationCap },
    { title: 'Projects', url: '/dashboard/projects', icon: Briefcase },
    { title: 'Sources', url: '/dashboard/sources', icon: FolderGit2 },
  ]

  const userItems: SidebarData['navGroups'][number]['items'] = [
    { title: 'Dashboard', url: '/dashboard/overview', icon: LayoutDashboard },
    { title: 'Courses', url: '/dashboard/courses', icon: BookOpen },
    { title: 'Projects', url: '/dashboard/projects', icon: Briefcase },
    { title: 'Sources', url: '/dashboard/sources', icon: FolderGit2 },
  ]

  return {
    user: {
      name: email.split('@')[0] || 'member',
      email,
      avatar: '/avatars/shadcn.jpg',
    },
    teams: [
      {
        name: 'Edu Center',
        logo: EduLogoIcon,
        plan: role === 'admin' ? 'Admin' : 'User',
        homeUrl: '/',
      },
    ],
    navGroups: [
      {
        title: role === 'admin' ? 'Admin Panel' : 'My Panel',
        items: role === 'admin' ? adminItems : userItems,
      },
    ],
  }
}

export const sidebarData: SidebarData = buildSidebarData('user', 'member@sammi.local')
