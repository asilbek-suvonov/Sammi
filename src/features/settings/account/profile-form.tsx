import { useState, type Dispatch, type SetStateAction } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useUserSettings } from '@/hooks/use-user-settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export type ProfileFormState = {
  nickname: string
  username: string
  firstName: string
  lastName: string
  bio: string
}

type Props = {
  profileForm: ProfileFormState
  setProfileForm: Dispatch<SetStateAction<ProfileFormState>>
}

export function ProfileForm({ profileForm, setProfileForm }: Props) {
  const { data, save } = useUserSettings()
  const [profileSaving, setProfileSaving] = useState(false)

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
    })
    setProfileSaving(false)
    if (ok) toast.success('Profile updated successfully')
  }

  return (
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
  )
}
