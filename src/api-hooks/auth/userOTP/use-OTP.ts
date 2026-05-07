import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { sendOtp, verifyOtp } from '@/service/auth/OTP/userOTP.service'
import type { EmailPayload, SendOtpResponse, VerifyOtpPayload, VerifyOtpResponse } from '@/service/auth/OTP/userOTP.type'
import type { ApiError } from '@/api'

export const useSendOtp = (options?: {
  onSuccess?: (data: SendOtpResponse) => void
  onError?: (error: ApiError) => void
}) => {
  return useMutation<SendOtpResponse, ApiError, EmailPayload>({
    mutationFn: sendOtp,
    onSuccess: (data) => {
      const message = typeof data?.message === 'string'
        ? data.message
        : 'Tasdiqlash kodi emailga yuborildi!'
      toast.success(message)
      options?.onSuccess?.(data)
    },
    onError: (error) => {
      // 400/500 toast already shown by interceptor
      options?.onError?.(error)
    },
  })
}

export const useVerifyOtp = (options?: {
  onSuccess?: (data: VerifyOtpResponse) => void
  onError?: (error: ApiError) => void
}) => {
  return useMutation<VerifyOtpResponse, ApiError, VerifyOtpPayload>({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      options?.onSuccess?.(data)
    },
    onError: (error) => {
      // 400/500 toast already shown by interceptor
      options?.onError?.(error)
    },
  })
}
