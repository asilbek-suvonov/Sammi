import { useRef, useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { usePatchProfile } from '@/api-hooks/profile/use-profile'
import type { Profile } from '@/service/profile/profile.types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const MAX_AVATAR_SIZE = 5 * 1024 * 1024

export function AvatarSection({ profile }: { profile: Profile }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const patch = usePatchProfile()

  const displayName = profile.nickname || profile.first_name || profile.email
  const usernameLine = profile.username || profile.email.split('@')[0]
  const initials = (
    profile.first_name?.[0] ??
    profile.nickname?.[0] ??
    profile.email?.[0] ??
    'U'
  ).toUpperCase()

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (fileRef.current) fileRef.current.value = ''
    if (!file) return
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error('Image is too large (max 5 MB).')
      return
    }
    setUploading(true)
    try {
      await patch.mutateAsync({ avatar: file })
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    await patch.mutateAsync({ avatar: null })
  }

  return (
    <div className='space-y-4'>
      <div>
        <h2 className='text-lg font-semibold'>Profile Picture</h2>
        <p className='text-sm text-muted-foreground'>
          Upload a photo or use initials as your avatar.
        </p>
      </div>
      <div className='flex items-center gap-6'>
        <div className='relative'>
          <Avatar className='size-20 border-2 border-border'>
            <AvatarImage src={profile.avatar_url ?? undefined} />
            <AvatarFallback className='text-2xl font-semibold'>
              {initials}
            </AvatarFallback>
          </Avatar>
          <button
            type='button'
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className='absolute -bottom-1 -end-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition hover:bg-primary/90 disabled:opacity-60'
            aria-label='Change avatar'
          >
            {uploading ? (
              <Loader2 className='size-3.5 animate-spin' />
            ) : (
              <Camera className='size-3.5' />
            )}
          </button>
          <input
            ref={fileRef}
            type='file'
            accept='image/*'
            onChange={handleFile}
            className='hidden'
          />
        </div>
        <div className='space-y-1'>
          <p className='text-sm font-medium'>{displayName}</p>
          <p className='text-xs text-muted-foreground'>@{usernameLine}</p>
          {profile.avatar_url && (
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='h-7 text-xs text-destructive hover:text-destructive'
              onClick={handleRemove}
              disabled={patch.isPending}
            >
              Remove photo
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
