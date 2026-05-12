import { Link } from '@tanstack/react-router'
import type { IContact } from '@/service/contact/contact.type'

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

interface Props {
  contact: IContact
  unread?: boolean
  onNavigate?: () => void
}

export function ContactNotificationItem({ contact, unread, onNavigate }: Props) {
  const initial = (contact.name?.[0] ?? '?').toUpperCase()

  return (
    <Link
      to='/dashboard/contacts/$id'
      params={{ id: String(contact.id) }}
      onClick={onNavigate}
      className='flex gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/40'
    >
      <div className='relative flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium'>
        {initial}
        {unread && (
          <span className='absolute -top-0.5 -end-0.5 size-2 rounded-full bg-primary ring-2 ring-background' />
        )}
      </div>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center justify-between gap-2'>
          <p className='truncate text-sm font-medium'>{contact.name}</p>
          <span className='shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground'>
            {formatWhen(contact.created_at)}
          </span>
        </div>
        <p className='truncate text-xs text-muted-foreground'>{contact.email}</p>
        <p className='mt-1 line-clamp-2 text-xs text-foreground/80'>
          {contact.message}
        </p>
      </div>
    </Link>
  )
}
