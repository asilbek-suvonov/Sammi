import { useMutation } from '@tanstack/react-query'
import { googleAuth, type GoogleAuthRequest, type GoogleAuthResponse } from '@/service/auth'

/**
 * React Query mutation hook for Google OAuth login.
 *
 * Usage:
 * ```tsx
 * const { mutate, isPending } = useGoogleAuth({
 *   onSuccess: (data) => { ... },
 *   onError: (error) => { ... },
 * })
 * ```
 */
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
