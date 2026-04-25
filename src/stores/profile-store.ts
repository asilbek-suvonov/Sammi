import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserProfile {
  nickname: string
  username: string
  avatarUrl: string
  bio: string
}

interface ProfileState {
  profile: UserProfile
  setProfile: (updates: Partial<UserProfile>) => void
  resetProfile: () => void
}

const defaultProfile: UserProfile = {
  nickname: '',
  username: '',
  avatarUrl: '',
  bio: '',
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      setProfile: (updates) =>
        set((state) => ({ profile: { ...state.profile, ...updates } })),
      resetProfile: () => set({ profile: defaultProfile }),
    }),
    { name: 'sammi_profile' }
  )
)
