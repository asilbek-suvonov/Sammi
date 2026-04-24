import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Separator } from '@radix-ui/react-select'
const UserCoursesView = () => {
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
      <Main fixed>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
          Cources
          </h1>
        </div>
    
        <Separator className='shadow-sm' />
        <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint enim illo ipsa quod, temporibus fugit quibusdam ab. Quos assumenda voluptatum consequuntur ea, mollitia maxime dignissimos odio tenetur sit ratione eaque illo ad porro odit, ipsa delectus deleniti voluptates laboriosam quaerat expedita, saepe aspernatur veniam cupiditate suscipit? Aperiam assumenda porro, velit odio labore magnam illum in voluptas eum consequatur exercitationem repellendus, impedit veniam laborum debitis. Eaque ab, iste modi similique unde eum autem ipsam voluptatum! Impedit tenetur minus odio? Alias, facere ea? Accusantium minus mollitia rem? Harum, ea, minus corporis dolorum delectus veniam dignissimos id provident molestiae odio numquam quisquam, animi quos totam vitae pariatur vero itaque corrupti? Ipsam, omnis placeat. Asperiores nulla atque hic fuga minima saepe quas distinctio esse quaerat porro consequuntur praesentium fugiat rerum et, consectetur odio? Vero laudantium quam nam praesentium facere, odit blanditiis fuga facilis, ipsam, perferendis labore quibusdam quos! Quaerat reprehenderit accusamus quod, voluptatibus aut voluptatum facere assumenda magni tempore ducimus quos modi eaque excepturi atque nostrum cupiditate labore in sed dolor? Ducimus sed beatae ullam corrupti vel reprehenderit magnam reiciendis aut accusamus provident nemo laudantium debitis aliquid, nihil sequi ex veritatis cumque ea minus aperiam optio possimus aspernatur! Obcaecati cumque architecto, amet ducimus ipsam sequi laudantium maiores culpa quae asperiores a et porro error soluta doloribus tempora dolore! Illo a consequuntur adipisci perferendis, optio laudantium eveniet sed reprehenderit possimus officiis incidunt minus repellat tempora laborum accusantium asperiores totam voluptate animi autem magni cumque vero, voluptatibus dolor? Expedita provident voluptatum, nemo velit non ad earum doloremque obcaecati aut necessitatibus cupiditate eum cumque consequatur ipsum. Iusto placeat nam rem ipsum quaerat excepturi ducimus aliquid aliquam laboriosam sit necessitatibus, ipsam, eveniet voluptatem sapiente iste, molestiae ad et atque dolor labore vel repellat commodi. Architecto delectus cumque incidunt dolore tempora, ullam recusandae pariatur. Quos molestiae consequuntur blanditiis obcaecati?
        </ul>
      </Main>
</>
  )
}

export default UserCoursesView
