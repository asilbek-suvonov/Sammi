import { useState, type ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useCreateContact } from '@/api-hooks/contact/use-contact'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const COOLDOWN_KEY = 'sammi_contact_last_send'
const COOLDOWN_MS = 60_000

const schema = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(80, 'Name is too long'),
  email: z.string().trim().email('Enter a valid email'),
  message: z
    .string()
    .trim()
    .min(10, 'Tell us a bit more (10+ characters)')
    .max(1000, 'Message is too long'),
  // Honeypot: must stay empty. Bots auto-fill all visible inputs.
  website: z.string().max(0, 'Spam detected'),
})

type FormValues = z.infer<typeof schema>

interface ContactDialogProps {
  trigger: ReactNode
  subject?: string
  title?: string
  description?: string
}

function readCooldown(): number {
  try {
    const raw = sessionStorage.getItem(COOLDOWN_KEY)
    return raw ? Number(raw) : 0
  } catch {
    return 0
  }
}

function getRemainingCooldownSeconds(): number {
  const last = readCooldown()
  if (!last) return 0
  const delta = Date.now() - last
  if (delta >= COOLDOWN_MS) return 0
  return Math.ceil((COOLDOWN_MS - delta) / 1000)
}

function markSent() {
  try {
    sessionStorage.setItem(COOLDOWN_KEY, String(Date.now()))
  } catch {
    // ignore
  }
}

export function ContactDialog({
  trigger,
  subject,
  title = 'Contact Us',
  description = 'Send us a message and we will get back to you shortly.',
}: ContactDialogProps) {
  const [open, setOpen] = useState(false)
  const { mutateAsync, isPending } = useCreateContact()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', message: '', website: '' },
    mode: 'onBlur',
  })

  const onSubmit = async (values: FormValues) => {
    const wait = getRemainingCooldownSeconds()
    if (wait > 0) {
      toast.error(`Please wait ${wait}s before sending another message.`)
      return
    }

    try {
      await mutateAsync({
        name: values.name,
        email: values.email,
        message: subject
          ? `[Subject: ${subject}] ${values.message}`
          : values.message,
      })
      markSent()
      toast.success('Message sent. We will reach out soon.')
      form.reset()
      setOpen(false)
    } catch {
      // Global axios interceptor surfaces the error toast.
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4'
          noValidate
        >
          <div className='space-y-2'>
            <Label htmlFor='contact-name'>Name</Label>
            <Input
              id='contact-name'
              autoComplete='name'
              placeholder='Your name'
              aria-invalid={!!form.formState.errors.name}
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className='text-xs text-destructive'>
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='contact-email'>Email</Label>
            <Input
              id='contact-email'
              type='email'
              autoComplete='email'
              placeholder='you@example.com'
              aria-invalid={!!form.formState.errors.email}
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className='text-xs text-destructive'>
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='contact-message'>Message</Label>
            <Textarea
              id='contact-message'
              rows={4}
              placeholder={
                subject
                  ? `Hi, I'm interested in "${subject}"...`
                  : 'How can we help?'
              }
              aria-invalid={!!form.formState.errors.message}
              {...form.register('message')}
            />
            {form.formState.errors.message && (
              <p className='text-xs text-destructive'>
                {form.formState.errors.message.message}
              </p>
            )}
          </div>

          {/* Honeypot: visually hidden, ignored by humans, filled by bots */}
          <div aria-hidden='true' className='hidden'>
            <Label htmlFor='contact-website'>Website</Label>
            <Input
              id='contact-website'
              tabIndex={-1}
              autoComplete='off'
              {...form.register('website')}
            />
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending && <Loader2 className='mr-2 size-4 animate-spin' />}
              {isPending ? 'Sending...' : 'Send Message'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
