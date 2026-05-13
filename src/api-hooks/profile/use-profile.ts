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
import { useAccessToken } from '@/stores/selectors'

export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
}

export function useProfile() {
  const accessToken = useAccessToken()
  return useQuery<Profile, Error>({
    queryKey: profileKeys.me(),
    queryFn: getProfile,
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation<Profile, Error, ProfileUpdateRequest>({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      qc.setQueryData(profileKeys.me(), data)
      qc.invalidateQueries({ queryKey: profileKeys.all })
      toast.success('Profile updated successfully')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update profile')
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
    onError: (err) => {
      toast.error(err.message || 'Failed to update profile')
    },
  })
}

export function useChangePassword() {
  return useMutation<void, Error, ChangePasswordRequest>({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to change password')
    },
  })
}
