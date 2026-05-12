import { createFileRoute } from '@tanstack/react-router'
import ContactDetail from '@/features/dashboard/contacts/contact-detail'
import { requireAdmin } from '@/lib/route-guards'

export const Route = createFileRoute('/_authenticated/dashboard/contacts/$id')({
  beforeLoad: () => {
    requireAdmin()
  },
  component: ContactDetailRoute,
})

function ContactDetailRoute() {
  const { id } = Route.useParams()
  return <ContactDetail id={id} />
}
