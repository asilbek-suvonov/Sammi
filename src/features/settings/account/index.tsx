import { useState } from 'react'
import { useUserSettings } from '@/hooks/use-user-settings'
import { Separator } from '@/components/ui/separator'
import { AvatarSection } from './avatar-section'
import { PasswordForm } from './password-form'
import { ProfileForm, type ProfileFormState } from './profile-form'

export function SettingsAccount() {
  const { data } = useUserSettings()

  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    nickname: data.nickname,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    bio: data.bio,
  })

  return (
    <div className='w-full max-w-2xl space-y-8 overflow-y-auto'>
      <AvatarSection
        previewNickname={profileForm.nickname}
        previewFirstName={profileForm.firstName}
        previewUsername={profileForm.username}
      />

      <Separator />

      <ProfileForm
        profileForm={profileForm}
        setProfileForm={setProfileForm}
      />

      <Separator />

      <PasswordForm />
    </div>
  )
}
