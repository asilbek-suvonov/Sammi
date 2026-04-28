

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { fonts } from '@/config/fonts'
import { useFont } from '@/context/font-provider'
import { useTheme } from '@/context/theme-provider'
import { cn } from '@/lib/utils'
import { Monitor, Moon, Sun } from 'lucide-react'

const themes = [
  { value: 'light' as const,  icon: Sun },
  { value: 'dark' as const,  icon: Moon },
  { value: 'system' as const,  icon: Monitor },
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
    <div className='w-full max-w-2xl space-y-10 overflow-y-auto'>
      {/* Theme Section */}
      <div className='space-y-4'>
        <div>
          <h2 className='text-lg font-semibold'>Theme</h2>
          <p className='text-sm text-muted-foreground'>
            Choose how the interface looks for you.
          </p>
        </div>
        <div className='flex flex-wrap gap-3'>
          {themes.map(({ value,  icon: Icon }) => (
            <button
              key={value}
              type='button'
              onClick={() => setTheme(value)}
              className={cn(
                'flex flex-col items-center rounded-xl border-2 p-2 transition-all hover:border-primary/50',
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
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Section */}
     <div className='mb-3'>
        <h2 className="text-lg font-semibold">Font</h2>
        <p className="text-sm text-muted-foreground">
          Select a font for the entire interface.
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className={`font-${font}`}>
              {fontLabels[font] ?? font}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64">
          <DropdownMenuRadioGroup
            value={font}
            onValueChange={(value) => setFont(value)}
          >
            {fonts.map((f) => (
              <DropdownMenuRadioItem key={f} value={f}>
                <div className="flex flex-col">
                  <span className={`font-${f} font-medium`}>
                    {fontLabels[f] ?? f}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {fontDescriptions[f] ?? ""}
                  </span>
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  )
}
