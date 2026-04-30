import { type SVGProps } from 'react'
import { Root as Radio } from '@radix-ui/react-radio-group'
import { IconDir } from '@/assets/custom/icon-dir'
import { useDirection } from '@/context/direction-provider'
import { RadioGroupItem } from './radio-group-item'
import { SectionTitle } from './section-title'

const ITEMS = [
  {
    value: 'ltr',
    label: 'Left to Right',
    icon: (props: SVGProps<SVGSVGElement>) => <IconDir dir='ltr' {...props} />,
  },
  {
    value: 'rtl',
    label: 'Right to Left',
    icon: (props: SVGProps<SVGSVGElement>) => <IconDir dir='rtl' {...props} />,
  },
]

export function DirectionConfig() {
  const { defaultDir, dir, setDir } = useDirection()
  return (
    <div>
      <SectionTitle
        title='Direction'
        showReset={defaultDir !== dir}
        onReset={() => setDir(defaultDir)}
      />
      <Radio
        value={dir}
        onValueChange={setDir}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label='Select site direction'
        aria-describedby='direction-description'
      >
        {ITEMS.map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id='direction-description' className='sr-only'>
        Choose between left-to-right or right-to-left site direction
      </div>
    </div>
  )
}
