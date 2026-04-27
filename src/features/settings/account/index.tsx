import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useUserSettings } from '@/hooks/use-user-settings'
import { toast } from 'sonner'
import { Camera, Eye, EyeOff, Loader2 } from 'lucide-react'

export function SettingsAccount() {
  const { data, save, uploadAvatar, removeAvatar } = useUserSettings()
  const fileRef = useRef<HTMLInputElement>(null)

  const [profileForm, setProfileForm] = useState({
    nickname: data.nickname,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    bio: data.bio,
  })
  const [avatarUrl, setAvatarUrl] = useState(data.avatarUrl)
  const [profileSaving, setProfileSaving] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)

  // Keep form in sync if store updates from elsewhere (e.g. another tab).
  useEffect(() => {
    setAvatarUrl(data.avatarUrl)
  }, [data.avatarUrl])

  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passSaving, setPassSaving] = useState(false)

  const initials = (
    profileForm.firstName?.[0] ?? data.email?.[0] ?? 'U'
  ).toUpperCase()

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (fileRef.current) fileRef.current.value = ''
    if (!file) return
    setAvatarUploading(true)
    const url = await uploadAvatar(file)
    setAvatarUploading(false)
    if (!url) return
    setAvatarUrl(url)
    if (save({ avatarUrl: url })) {
      toast.success('Profile picture updated')
    }
  }

  const handleRemoveAvatar = () => {
    setAvatarUrl('')
    removeAvatar()
    toast.success('Profile picture removed')
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileForm.nickname.trim()) {
      toast.error('Nickname is required')
      return
    }
    if (!profileForm.username.trim()) {
      toast.error('Username is required')
      return
    }
    setProfileSaving(true)
    await new Promise((r) => setTimeout(r, 400))
    const ok = save({
      nickname: profileForm.nickname.trim(),
      username: profileForm.username.trim(),
      firstName: profileForm.firstName.trim(),
      lastName: profileForm.lastName.trim(),
      bio: profileForm.bio.trim(),
      avatarUrl,
    })
    setProfileSaving(false)
    if (ok) toast.success('Profile updated successfully')
  }

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passForm.currentPassword) {
      toast.error('Please enter current password')
      return
    }
    if (passForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setPassSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setPassSaving(false)
    setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    toast.success('Password changed successfully')
  }

  return (
    <div className='w-full max-w-2xl space-y-8 overflow-y-auto'>
      {/* Avatar Section */}
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
              {profileForm.nickname || profileForm.firstName || data.email}
            </p>
            <p className='text-xs text-muted-foreground'>
              @{profileForm.username || data.email.split('@')[0]}
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

      <Separator />

      {/* Profile Form */}
      <form onSubmit={handleProfileSave} className='space-y-6'>
        <div>
          <h2 className='text-lg font-semibold'>Personal Info</h2>
          <p className='text-sm text-muted-foreground'>
            Update your display name and username.
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='firstName'>First Name</Label>
            <Input
              id='firstName'
              value={profileForm.firstName}
              onChange={(e) =>
                setProfileForm((f) => ({ ...f, firstName: e.target.value }))
              }
              placeholder='John'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='lastName'>Last Name</Label>
            <Input
              id='lastName'
              value={profileForm.lastName}
              onChange={(e) =>
                setProfileForm((f) => ({ ...f, lastName: e.target.value }))
              }
              placeholder='Doe'
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='nickname'>Nickname</Label>
          <Input
            id='nickname'
            value={profileForm.nickname}
            onChange={(e) =>
              setProfileForm((f) => ({ ...f, nickname: e.target.value }))
            }
            placeholder='Your display name'
          />
          <p className='text-xs text-muted-foreground'>
            This is the name shown across the platform.
          </p>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='username'>Username</Label>
          <div className='relative'>
            <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
              @
            </span>
            <Input
              id='username'
              value={profileForm.username}
              onChange={(e) =>
                setProfileForm((f) => ({ ...f, username: e.target.value }))
              }
              placeholder='johndoe'
              className='pl-7'
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='bio'>Bio</Label>
          <Textarea
            id='bio'
            value={profileForm.bio}
            onChange={(e) =>
              setProfileForm((f) => ({ ...f, bio: e.target.value }))
            }
            placeholder='Tell us a bit about yourself.'
            rows={3}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            value={data.email}
            readOnly
            disabled
            className='cursor-not-allowed opacity-60'
          />
          <p className='text-xs text-muted-foreground'>
            Email cannot be changed here.
          </p>
        </div>

        <Button type='submit' disabled={profileSaving}>
          {profileSaving && <Loader2 className='mr-2 size-4 animate-spin' />}
          Save Profile
        </Button>
      </form>

      <Separator />

      {/* Password Section */}
      <form onSubmit={handlePasswordSave} className='space-y-6'>
        <div>
          <h2 className='text-lg font-semibold'>Change Password</h2>
          <p className='text-sm text-muted-foreground'>
            Use a strong password of at least 8 characters.
          </p>
        </div>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='currentPassword'>Current Password</Label>
            <div className='relative'>
              <Input
                id='currentPassword'
                type={showCurrent ? 'text' : 'password'}
                value={passForm.currentPassword}
                onChange={(e) =>
                  setPassForm((f) => ({ ...f, currentPassword: e.target.value }))
                }
                placeholder='Enter current password'
                className='pr-10'
              />
              <button
                type='button'
                onClick={() => setShowCurrent((v) => !v)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                {showCurrent ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
              </button>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='newPassword'>New Password</Label>
            <div className='relative'>
              <Input
                id='newPassword'
                type={showNew ? 'text' : 'password'}
                value={passForm.newPassword}
                onChange={(e) =>
                  setPassForm((f) => ({ ...f, newPassword: e.target.value }))
                }
                placeholder='Min. 8 characters'
                className='pr-10'
              />
              <button
                type='button'
                onClick={() => setShowNew((v) => !v)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                {showNew ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
              </button>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Confirm New Password</Label>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showConfirm ? 'text' : 'password'}
                value={passForm.confirmPassword}
                onChange={(e) =>
                  setPassForm((f) => ({ ...f, confirmPassword: e.target.value }))
                }
                placeholder='Repeat new password'
                className='pr-10'
              />
              <button
                type='button'
                onClick={() => setShowConfirm((v) => !v)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                {showConfirm ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
              </button>
            </div>
          </div>
        </div>

        <Button type='submit' disabled={passSaving}>
          {passSaving && <Loader2 className='mr-2 size-4 animate-spin' />}
          Change Password
        </Button>
      </form>
    </div>
  )
}
