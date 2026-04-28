import eduLogo from '@/assets/EduLogo.png'

export function EduLogoIcon({ className }: { className?: string }) {
  return <img src={eduLogo} alt='Edu Center' className={className} style={{ objectFit: 'contain' }} />
}
