/* eslint-disable react-refresh/only-export-components */
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { requireAdmin } from '@/lib/route-guards'
import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink, FolderGit2, GitBranch, Star } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/dashboard/sources')({
  beforeLoad: () => {
    requireAdmin()
  },
  component: SourcesPage,
})

