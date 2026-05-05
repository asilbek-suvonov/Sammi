import { useRef, useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useUserSettings } from '@/hooks/use-user-settings'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

type Props = {
  previewNickname: string
  previewFirstName: string
  previewUsername: string
}

export function AvatarSection({
  previewNickname,
  previewFirstName,
  previewUsername,
}: Props) {
  const { data, save, uploadAvatar, removeAvatar } = useUserSettings()
  const fileRef = useRef<HTMLInputElement>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)

  const avatarUrl = data.avatarUrl
  const initials = (previewFirstName?.[0] ?? data.email?.[0] ?? 'U').toUpperCase()

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (fileRef.current) fileRef.current.value = ''
    if (!file) return
    setAvatarUploading(true)
    const url = await uploadAvatar(file)
    setAvatarUploading(false)
    if (!url) return
    if (save({ avatarUrl: url })) {
      toast.success('Profile picture updated')
    }
  }

  const handleRemoveAvatar = () => {
    removeAvatar()
    toast.success('Profile picture removed')
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
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className='text-2xl font-semibold'>
              {initials}
            </AvatarFallback>
          </Avatar>
          <button
            type='button'
            onClick={() => fileRef.current?.click()}
            disabled={avatarUploading}
            className='absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition hover:bg-primary/90 disabled:opacity-60'
          >
            {avatarUploading ? (
              <Loader2 className='size-3.5 animate-spin' />
            ) : (
              <Camera className='size-3.5' />
            )}
          </button>
          <input
            ref={fileRef}
            type='file'
            accept='image/*'
            onChange={handleAvatarFile}
            className='hidden'
          />
        </div>
        <div className='space-y-1'>
          <p className='text-sm font-medium'>
            {previewNickname || previewFirstName || data.email}
          </p>
          <p className='text-xs text-muted-foreground'>
            @{previewUsername || data.email.split('@')[0]}
          </p>
          {avatarUrl && (
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='h-7 text-xs text-destructive hover:text-destructive'
              onClick={handleRemoveAvatar}
            >
              Remove photo
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
