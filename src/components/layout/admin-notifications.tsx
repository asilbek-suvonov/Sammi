import { useMemo, useState } from 'react'
import { AlertTriangle, Bell, CheckCheck, Loader2 } from 'lucide-react'
import { useContacts } from '@/api-hooks/contact/use-contact'
import { useContactReadStore } from '@/stores/contact-read-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContactNotificationItem } from './contact-notification-item'

export function AdminNotifications() {
  const [open, setOpen] = useState(false)
  const { data, isLoading, isError, refetch } = useContacts()
  const contacts = useMemo(() => data?.results ?? [], [data])

  const readIds = useContactReadStore((s) => s.readIds)
  const markAllRead = useContactReadStore((s) => s.markAllRead)

  const { unread, read } = useMemo(() => {
    const set = new Set(readIds)
    return {
      unread: contacts.filter((c) => !set.has(c.id)),
      read: contacts.filter((c) => set.has(c.id)),
    }
  }, [contacts, readIds])

  const close = () => setOpen(false)
  const handleMarkAll = () => markAllRead(unread.map((c) => c.id))

  const placeholder = (variant: 'loading' | 'empty' | 'error', text: string) => {
    if (variant === 'error') {
      return (
        <div className='flex flex-col items-center gap-2 py-10 text-center text-sm'>
          <AlertTriangle className='size-5 text-destructive' />
          <p className='text-muted-foreground'>{text}</p>
          <Button size='sm' variant='outline' onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )
    }
    if (variant === 'loading') {
      return (
        <div className='flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground'>
          <Loader2 className='size-4 animate-spin' />
          {text}
        </div>
      )
    }
    return (
      <p className='py-10 text-center text-sm text-muted-foreground'>{text}</p>
    )
  }

  const renderList = (
    list: typeof contacts,
    unreadTab: boolean,
    emptyText: string
  ) => {
    if (isError) return placeholder('error', 'Failed to load messages.')
    if (isLoading && contacts.length === 0)
      return placeholder('loading', 'Loading messages...')
    if (list.length === 0) return placeholder('empty', emptyText)
    return list.map((c) => (
      <ContactNotificationItem
        key={c.id}
        contact={c}
        unread={unreadTab}
        onNavigate={close}
      />
    ))
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          aria-label='Open messages'
          className='relative scale-95 rounded-full'
        >
          <Bell aria-hidden='true' />
          {unread.length > 0 && (
            <Badge
              variant='destructive'
              className='absolute -top-0.5 -end-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none'
            >
              {unread.length > 99 ? '99+' : unread.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className='flex w-full flex-col gap-4 sm:max-w-md'>
        <SheetHeader className='pb-0 text-start'>
          <SheetTitle>Messages</SheetTitle>
          <SheetDescription>
            Contact form submissions from your visitors.
          </SheetDescription>
        </SheetHeader>

        <Tabs
          defaultValue='unread'
          className='flex flex-1 flex-col overflow-hidden px-4'
        >
          <div className='w-full flex items-center justify-between gap-2'>
            <TabsList className='grid w-full max-w-[460px] grid-cols-2'>
              <TabsTrigger value='unread'>
                Unread{unread.length > 0 ? ` (${unread.length})` : ''}
              </TabsTrigger>
              <TabsTrigger value='read'>Read</TabsTrigger>
            </TabsList>
            {unread.length > 0 && (
              <Button
                size='sm'
                variant='ghost'
                onClick={handleMarkAll}
                className='gap-1.5 text-xs'
              >
                <CheckCheck className='size-3.5' />
                Mark all
              </Button>
            )}
          </div>

          <ScrollArea className='mt-3 flex-1 pe-2'>
            <TabsContent value='unread' className='m-0 space-y-2'>
              {renderList(unread, true, 'No new messages.')}
            </TabsContent>
            <TabsContent value='read' className='m-0 space-y-2'>
              {renderList(read, false, 'No read messages yet.')}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
