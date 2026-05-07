import { API_ENDPOINTS } from '@/endpoints/api_endpoints'
import type { EmailPayload, SendOtpResponse, VerifyOtpPayload, VerifyOtpResponse } from './userOTP.type'
import api from '@/api'

export const sendOtp = (data: EmailPayload): Promise<SendOtpResponse> =>
  api.post<SendOtpResponse>(API_ENDPOINTS.ACCOUNTS.SEND_OTP, data)

export const verifyOtp = (data: VerifyOtpPayload): Promise<VerifyOtpResponse> =>
  api.post<VerifyOtpResponse>(API_ENDPOINTS.ACCOUNTS.VERIFY_OTP, data)
