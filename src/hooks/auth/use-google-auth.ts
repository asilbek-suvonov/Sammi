import { useMutation } from '@tanstack/react-query'
import { googleAuth } from '@/service/auth'
import type { GoogleAuthRequest, GoogleAuthResponse } from '@/service/auth'

export const useGoogleAuth = (options?: {
  onSuccess?: (data: GoogleAuthResponse) => void
  onError?: (error: Error) => void
}) => {
  return useMutation<GoogleAuthResponse, Error, GoogleAuthRequest>({
    mutationFn: googleAuth,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}