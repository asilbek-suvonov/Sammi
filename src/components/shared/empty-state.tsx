import { type LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'

type Props = {
  icon?: LucideIcon
  title: string
  description?: ReactNode
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className='flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
      {Icon && <Icon className='mb-3 size-10 text-muted-foreground/50' />}
      <p className='text-sm font-medium'>{title}</p>
      {description && (
        <p className='mt-1 text-xs text-muted-foreground'>{description}</p>
      )}
      {action && <div className='mt-3'>{action}</div>}
    </div>
  )
}
