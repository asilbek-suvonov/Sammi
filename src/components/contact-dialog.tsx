import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
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

interface ContactDialogProps {
  trigger: ReactNode
  subject?: string
  title?: string
  description?: string
}

export function ContactDialog({
  trigger,
  subject,
  title = 'Contact Us',
  description = 'Send us a message and we will get back to you shortly.',
}: ContactDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    if (!data.get('name') || !data.get('email') || !data.get('message')) {
      toast.error('Please fill all fields.')
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setOpen(false)
      form.reset()
      toast.success('Message sent. We will reach out soon.')
    }, 600)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {subject && <input type='hidden' name='subject' value={subject} />}
          <div className='space-y-2'>
            <Label htmlFor='contact-name'>Name</Label>
            <Input id='contact-name' name='name' placeholder='Your name' required />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='contact-email'>Email</Label>
            <Input id='contact-email' name='email' type='email' placeholder='you@example.com' required />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='contact-message'>Message</Label>
            <Textarea
              id='contact-message'
              name='message'
              rows={4}
              placeholder={subject ? `Hi, I'm interested in "${subject}"...` : 'How can we help?'}
              required
            />
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type='submit' disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
