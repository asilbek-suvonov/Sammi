import { Root as Radio } from '@radix-ui/react-radio-group'
import { IconSidebarFloating } from '@/assets/custom/icon-sidebar-floating'
import { IconSidebarInset } from '@/assets/custom/icon-sidebar-inset'
import { IconSidebarSidebar } from '@/assets/custom/icon-sidebar-sidebar'
import { useLayout } from '@/context/layout-provider'
import { RadioGroupItem } from './radio-group-item'
import { SectionTitle } from './section-title'

const ITEMS = [
  { value: 'inset', label: 'Inset', icon: IconSidebarInset },
  { value: 'floating', label: 'Floating', icon: IconSidebarFloating },
  { value: 'sidebar', label: 'Sidebar', icon: IconSidebarSidebar },
]

export function SidebarConfig() {
  const { defaultVariant, variant, setVariant } = useLayout()
  return (
    <div className='max-md:hidden'>
      <SectionTitle
        title='Sidebar'
        showReset={defaultVariant !== variant}
        onReset={() => setVariant(defaultVariant)}
      />
      <Radio
        value={variant}
        onValueChange={setVariant}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label='Select sidebar style'
        aria-describedby='sidebar-description'
      >
        {ITEMS.map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id='sidebar-description' className='sr-only'>
        Choose between inset, floating, or standard sidebar layout
      </div>
    </div>
  )
}
