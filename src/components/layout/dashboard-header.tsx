import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAuthRole } from '@/stores/selectors'
import { AdminNotifications } from './admin-notifications'
import { Header } from './header'

export function DashboardHeader() {
  const role = useAuthRole()
  return (
    <Header>
      <Search />
      <div className='ms-auto flex items-center gap-4'>
        {role === 'admin' && <AdminNotifications />}
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </div>
    </Header>
  )
}
