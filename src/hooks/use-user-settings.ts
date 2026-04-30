import { useCallback } from 'react'
import { toast } from 'sonner'
import {
  useAuthActions,
  useAuthUser,
  useProfile,
  useSetProfile,
} from '@/stores/selectors'

const MAX_AVATAR_DIMENSION = 256
const AVATAR_QUALITY = 0.85

const compressImageFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Invalid image'))
      img.onload = () => {
        const ratio = Math.min(
          1,
          MAX_AVATAR_DIMENSION / Math.max(img.width, img.height)
        )
        const w = Math.round(img.width * ratio)
        const h = Math.round(img.height * ratio)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas not supported'))
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', AVATAR_QUALITY))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })

export interface UserSettingsData {
  firstName: string
  lastName: string
  nickname: string
  username: string
  bio: string
  avatarUrl: string
  email: string
}

export function useUserSettings() {
  const user = useAuthUser()
  const { setUser } = useAuthActions()
  const profile = useProfile()
  const setProfile = useSetProfile()

  const data: UserSettingsData = {
    firstName: profile.firstName ?? user?.firstName ?? '',
    lastName: profile.lastName ?? user?.lastName ?? '',
    nickname: profile.nickname || user?.firstName || '',
    username: profile.username || user?.accountNo || '',
    bio: profile.bio ?? '',
    avatarUrl: profile.avatarUrl ?? '',
    email: user?.email ?? '',
  }

  const save = useCallback(
    (updates: Partial<UserSettingsData>): boolean => {
      try {
        setProfile({
          nickname: updates.nickname ?? data.nickname,
          username: updates.username ?? data.username,
          avatarUrl: updates.avatarUrl ?? data.avatarUrl,
          bio: updates.bio ?? data.bio,
          firstName: updates.firstName ?? data.firstName,
          lastName: updates.lastName ?? data.lastName,
        })

        if (user) {
          setUser({
            ...user,
            firstName: updates.firstName ?? user.firstName,
            lastName: updates.lastName ?? user.lastName,
          })
        }
        return true
      } catch (err) {
        const isQuota =
          err instanceof DOMException &&
          (err.name === 'QuotaExceededError' || err.code === 22)
        toast.error(
          isQuota
            ? 'Storage limit reached — try a smaller avatar image.'
            : 'Could not save settings.'
        )
        return false
      }
    },
    [data.avatarUrl, data.bio, data.firstName, data.lastName, data.nickname, data.username, setProfile, setUser, user]
  )

  const uploadAvatar = useCallback(async (file: File): Promise<string | null> => {
    try {
      const compressed = await compressImageFile(file)
      return compressed
    } catch {
      toast.error('Could not load image. Please try a different file.')
      return null
    }
  }, [])

  const removeAvatar = useCallback(() => {
    setProfile({ avatarUrl: '' })
  }, [setProfile])

  return { data, save, uploadAvatar, removeAvatar }
}
