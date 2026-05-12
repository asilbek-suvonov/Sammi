import { useEffect, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, AtSign, Calendar, Mail, MailOpen } from 'lucide-react'
import { useContacts } from '@/api-hooks/contact/use-contact'
import { useContactReadStore } from '@/stores/contact-read-store'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'

function formatFull(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

interface Props {
  id: string
}

export default function ContactDetail({ id }: Props) {
  const numericId = Number(id)
  const { data, isLoading } = useContacts()
  const contact = useMemo(
    () => data?.results.find((c) => c.id === numericId),
    [data, numericId]
  )

  const isRead = useContactReadStore((s) => s.readIds.includes(numericId))
  const markRead = useContactReadStore((s) => s.markRead)
  const markUnread = useContactReadStore((s) => s.markUnread)

  useEffect(() => {
    if (contact) markRead(contact.id)
  }, [contact, markRead])

  if (!contact) {
    return (
      <Main>
        <Button asChild variant='ghost' size='sm' className='mb-4 gap-1'>
          <Link to='/dashboard/overview'>
            <ArrowLeft className='size-4' />
            Back
          </Link>
        </Button>
        <p className='text-sm text-muted-foreground'>
          {isLoading ? 'Loading message...' : 'Message not found.'}
        </p>
      </Main>
    )
  }

  const initial = (contact.name?.[0] ?? '?').toUpperCase()

  return (
    <Main>
      <Button asChild variant='ghost' size='sm' className='mb-4 gap-1'>
        <Link to='/dashboard/overview'>
          <ArrowLeft className='size-4' />
          Back
        </Link>
      </Button>

      <div className='rounded-xl border bg-card p-6'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='flex size-12 items-center justify-center rounded-full bg-muted text-lg font-medium'>
              {initial}
            </div>
            <div>
              <h1 className='text-lg font-semibold'>{contact.name}</h1>
              <a
                href={`mailto:${contact.email}`}
                className='flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
              >
                <AtSign className='size-3.5' />
                {contact.email}
              </a>
            </div>
          </div>
          <Button
            variant='outline'
            size='sm'
            className='gap-1.5'
            onClick={() =>
              isRead ? markUnread(contact.id) : markRead(contact.id)
            }
          >
            {isRead ? (
              <>
                <Mail className='size-4' />
                Mark unread
              </>
            ) : (
              <>
                <MailOpen className='size-4' />
                Mark read
              </>
            )}
          </Button>
        </div>

        <Separator className='my-4' />

        <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
          <Calendar className='size-3.5' />
          {formatFull(contact.created_at)}
        </div>

        <p className='mt-4 whitespace-pre-wrap text-sm leading-relaxed'>
          {contact.message}
        </p>

        <div className='mt-6 flex justify-end'>
          <Button asChild size='sm' className='gap-1.5'>
            <a href={`mailto:${contact.email}`}>
              <Mail className='size-4' />
              Reply via Email
            </a>
          </Button>
        </div>
      </div>
    </Main>
  )
}
