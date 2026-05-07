import { useMutation } from '@tanstack/react-query';
import { verifyOtp } from '@/service/auth/OTP/userOTP.service';
import type { VerifyOtpPayload, VerifyOtpResponse } from '@/service/auth/OTP/userOTP.type';

export const useVerifyOtp = (options?: {
  onSuccess?: (data: VerifyOtpResponse) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpPayload>({
    mutationFn: (data) => verifyOtp(data), // yoki shunchaki verifyOtp
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};