import { useFont } from '@/context/font-provider'
import { useTheme } from '@/context/theme-provider'
import { fonts } from '@/config/fonts'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Monitor, Moon, Sun } from 'lucide-react'

const themes = [
  { value: 'light' as const, label: 'Light', icon: Sun },
  { value: 'dark' as const, label: 'Dark', icon: Moon },
  { value: 'system' as const, label: 'System', icon: Monitor },
]

const fontLabels: Record<string, string> = {
  inter: 'Inter',
  manrope: 'Manrope',
  system: 'System Default',
}

const fontDescriptions: Record<string, string> = {
  inter: 'Clean and modern — great for readability',
  manrope: 'Geometric and friendly — ideal for UI',
  system: 'Uses your OS default font',
}

export function SettingsAppearance() {
  const { theme, setTheme } = useTheme()
  const { font, setFont } = useFont()

  return (
    <div className='w-full max-w-2xl space-y-10'>
      {/* Theme Section */}
      <div className='space-y-4'>
        <div>
          <h2 className='text-lg font-semibold'>Theme</h2>
          <p className='text-sm text-muted-foreground'>
            Choose how the interface looks for you.
          </p>
        </div>
        <div className='flex flex-wrap gap-3'>
          {themes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type='button'
              onClick={() => setTheme(value)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:border-primary/50',
                theme === value
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:bg-muted/50'
              )}
            >
              <div
                className={cn(
                  'flex size-10 items-center justify-center rounded-lg',
                  theme === value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <Icon className='size-5' />
              </div>
              <span
                className={cn(
                  'text-sm font-medium',
                  theme === value ? 'text-primary' : 'text-foreground'
                )}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Section */}
      <div className='space-y-4'>
        <div>
          <h2 className='text-lg font-semibold'>Font</h2>
          <p className='text-sm text-muted-foreground'>
            Select a font for the entire interface.
          </p>
        </div>
        <div className='flex flex-col gap-3'>
          {fonts.map((f) => (
            <button
              key={f}
              type='button'
              onClick={() => setFont(f)}
              className={cn(
                'flex items-center justify-between rounded-xl border-2 p-4 text-start transition-all hover:border-primary/50',
                font === f
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:bg-muted/50'
              )}
            >
              <div className='space-y-0.5'>
                <p
                  className={cn(
                    'text-sm font-semibold',
                    `font-${f}`,
                    font === f ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {fontLabels[f] ?? f}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {fontDescriptions[f] ?? ''}
                </p>
              </div>
              <div
                className={cn(
                  'flex size-5 items-center justify-center rounded-full border-2',
                  font === f
                    ? 'border-primary bg-primary'
                    : 'border-border bg-background'
                )}
              >
                {font === f && (
                  <div className='size-2 rounded-full bg-primary-foreground' />
                )}
              </div>
            </button>
          ))}
        </div>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => setFont(fonts[0])}
          className='text-xs text-muted-foreground'
        >
          Reset to default
        </Button>
      </div>
    </div>
  )
}
