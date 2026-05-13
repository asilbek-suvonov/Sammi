import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  changePassword,
  getProfile,
  patchProfile,
  updateProfile,
} from '@/service/profile/profile.service'
import type {
  ChangePasswordRequest,
  Profile,
  ProfileUpdateRequest,
} from '@/service/profile/profile.types'
import { useIsAuthed } from '@/stores/selectors'

export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
}

export function useProfile() {
  // Enable for any signed-in flow (JWT or social session cookie).
  // The endpoint accepts either Bearer or session auth.
  const isAuthed = useIsAuthed()
  return useQuery<Profile, Error>({
    queryKey: profileKeys.me(),
    queryFn: getProfile,
    enabled: isAuthed,
    staleTime: 5 * 60 * 1000,
  })
}

// Error toasts are emitted globally by the axios interceptor.
export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation<Profile, Error, ProfileUpdateRequest>({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      qc.setQueryData(profileKeys.me(), data)
      qc.invalidateQueries({ queryKey: profileKeys.all })
      toast.success('Profile updated successfully')
    },
  })
}

export function usePatchProfile() {
  const qc = useQueryClient()
  return useMutation<Profile, Error, ProfileUpdateRequest>({
    mutationFn: patchProfile,
    onSuccess: (data) => {
      qc.setQueryData(profileKeys.me(), data)
      qc.invalidateQueries({ queryKey: profileKeys.all })
      toast.success('Profile updated successfully')
    },
  })
}

export function useChangePassword() {
  return useMutation<void, Error, ChangePasswordRequest>({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully')
    },
  })
}
