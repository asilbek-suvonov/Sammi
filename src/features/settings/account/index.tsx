import { useState, useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useProfileStore } from '@/stores/profile-store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Camera, Eye, EyeOff, Loader2 } from 'lucide-react'

export function SettingsAccount() {
  const { auth } = useAuthStore()
  const { profile, setProfile } = useProfileStore()
  const user = auth.user
  const fileRef = useRef<HTMLInputElement>(null)

  const [profileForm, setProfileForm] = useState({
    nickname: profile.nickname || user?.firstName || '',
    username: profile.username || user?.accountNo || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  })
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '')
  const [profileSaving, setProfileSaving] = useState(false)

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
    (profileForm.firstName?.[0] ?? user?.email?.[0] ?? 'U')
  ).toUpperCase()

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const url = (ev.target?.result ?? '') as string
      setAvatarUrl(url)
    }
    reader.readAsDataURL(file)
    if (fileRef.current) fileRef.current.value = ''
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
    await new Promise((r) => setTimeout(r, 600))
    setProfile({
      nickname: profileForm.nickname,
      username: profileForm.username,
      avatarUrl,
    })
    auth.setUser(
      user
        ? { ...user, firstName: profileForm.firstName, lastName: profileForm.lastName }
        : null
    )
    setProfileSaving(false)
    toast.success('Profile updated successfully')
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
    <div className='w-full max-w-2xl space-y-8'>
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
              className='absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition hover:bg-primary/90'
            >
              <Camera className='size-3.5' />
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
              {profileForm.nickname || profileForm.firstName || user?.email}
            </p>
            <p className='text-xs text-muted-foreground'>
              @{profileForm.username || user?.accountNo}
            </p>
            {avatarUrl && (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='h-7 text-xs text-destructive hover:text-destructive'
                onClick={() => setAvatarUrl('')}
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
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            value={user?.email ?? ''}
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
