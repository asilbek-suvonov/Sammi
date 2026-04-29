import { Root as Radio } from '@radix-ui/react-radio-group'
import { IconThemeDark } from '@/assets/custom/icon-theme-dark'
import { IconThemeLight } from '@/assets/custom/icon-theme-light'
import { IconThemeSystem } from '@/assets/custom/icon-theme-system'
import { useTheme } from '@/context/theme-provider'
import { RadioGroupItem } from './radio-group-item'
import { SectionTitle } from './section-title'

const ITEMS = [
  { value: 'system', label: 'System', icon: IconThemeSystem },
  { value: 'light', label: 'Light', icon: IconThemeLight },
  { value: 'dark', label: 'Dark', icon: IconThemeDark },
]

export function ThemeConfig() {
  const { defaultTheme, theme, setTheme } = useTheme()
  return (
    <div>
      <SectionTitle
        title='Theme'
        showReset={theme !== defaultTheme}
        onReset={() => setTheme(defaultTheme)}
      />
      <Radio
        value={theme}
        onValueChange={setTheme}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label='Select theme preference'
        aria-describedby='theme-description'
      >
        {ITEMS.map((item) => (
          <RadioGroupItem key={item.value} item={item} isTheme />
        ))}
      </Radio>
      <div id='theme-description' className='sr-only'>
        Choose between system preference, light mode, or dark mode
      </div>
    </div>
  )
}
