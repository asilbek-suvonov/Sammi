import { Link } from '@tanstack/react-router'
import eduLogo from '@/assets/EduLogo.png'

interface SammiLogoProps {
  asLink?: boolean
}

const Inner = () => (
  <>
    <img src={eduLogo} alt='Edu Center' className='size-7 object-contain' />
    <span className='text-sm font-semibold tracking-tight'>Edu Center</span>
  </>
)

export function SammiLogo({ asLink = false }: SammiLogoProps) {
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
