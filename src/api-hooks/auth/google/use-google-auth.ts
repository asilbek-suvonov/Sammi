import { useMutation } from '@tanstack/react-query'
import { googleAuth, type GoogleAuthRequest, type GoogleAuthResponse } from '@/service/auth'


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
