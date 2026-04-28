import * as React from 'react'
import { Check, ChevronsUpDown, PlusCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export type MultiSelectOption = { label: string; value: string }

type MultiSelectProps = {
  value: string[]
  onChange: (value: string[]) => void
  options?: MultiSelectOption[]
  placeholder?: string
  className?: string
}

export function MultiSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const toggle = (item: string) => {
    onChange(value.includes(item) ? value.filter((v) => v !== item) : [...value, item])
  }

  const allOptions = React.useMemo(
    () => [
      ...options,
      ...value
        .filter((v) => !options.some((o) => o.value === v))
        .map((v) => ({ label: v, value: v })),
    ],
    [options, value]
  )

  const filtered = allOptions.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  )

  const isCustom =
    search.trim().length > 0 &&
    !allOptions.some((o) => o.value.toLowerCase() === search.trim().toLowerCase())

  const handleAddCustom = () => {
    const trimmed = search.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setSearch('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role='combobox'
          aria-expanded={open}
          className={cn(
            'flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs cursor-pointer transition-colors hover:bg-accent/10',
            open && 'ring-[3px] ring-ring/50',
            className
          )}
        >
          {value.length > 0 ? (
            value.map((item) => (
              <Badge
                key={item}
                variant='secondary'
                className='h-6 gap-0.5 pr-1 text-xs font-normal'
              >
                {item}
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation()
                    toggle(item)
                  }}
                  className='ml-0.5 rounded-sm hover:text-destructive focus:outline-none'
                >
                  <X className='size-3' />
                </button>
              </Badge>
            ))
          ) : (
            <span className='text-muted-foreground'>{placeholder}</span>
          )}
          <ChevronsUpDown className='ml-auto size-4 shrink-0 opacity-50' />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className='p-0'
        style={{ width: 'var(--radix-popover-trigger-width)' }}
        align='start'
      >
        <Command>
          <CommandInput
            placeholder='Search or type to add...'
            value={search}
            onValueChange={setSearch}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isCustom) {
                e.preventDefault()
                handleAddCustom()
              }
            }}
          />
          <CommandList>
            {isCustom && (
              <CommandGroup>
                <CommandItem onSelect={handleAddCustom}>
                  <PlusCircle className='size-4 text-muted-foreground' />
                  Add &quot;{search.trim()}&quot;
                </CommandItem>
              </CommandGroup>
            )}
            {filtered.length === 0 && !isCustom && (
              <CommandEmpty>No options found.</CommandEmpty>
            )}
            {filtered.length > 0 && (
              <CommandGroup>
                {filtered.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    onSelect={() => toggle(opt.value)}
                  >
                    <Check
                      className={cn(
                        'size-4',
                        value.includes(opt.value) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
