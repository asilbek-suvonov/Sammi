import { Link } from '@tanstack/react-router'

interface EduLogoProps {
  asLink?: boolean
}

const Inner = () => (
  <>
    <span className='text-sm font-semibold tracking-tight'>Edu Center</span>
  </>
)

export function EduLogo({ asLink = false }: EduLogoProps) {
  if (asLink) {
    return (
      <Link to='/' className='flex items-center gap-2'>
        <Inner />
      </Link>
    )
  }
  return (
    <div className='flex items-center gap-2'>
      <Inner />
    </div>
  )
}
