import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { SourceCard } from '@/components/cards/source-card'
import { ThemeSwitch } from '@/components/theme-switch'
import { Separator } from '@/components/ui/separator'
import { useAdminStore } from '@/stores/admin-store'

const UserSources = () => {
  const { sources } = useAdminStore()

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Sources</h1>
          <p className='text-sm text-muted-foreground'>
            Open-source repositories and learning resources.
          </p>
        </div>

        <Separator className='my-4' />

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {sources.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      </Main>
    </>
  )
}

export default UserSources
