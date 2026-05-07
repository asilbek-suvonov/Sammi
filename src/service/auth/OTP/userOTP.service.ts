import { API_ENDPOINTS } from '@/endpoints/api_endpoints';
import type { VerifyOtpPayload, VerifyOtpResponse } from './userOTP.type';
import api from '@/api';

export const verifyOtp = async (data: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
  // .data ni qaytarish muhim
  const response = await api.post<VerifyOtpResponse>(API_ENDPOINTS.ACCOUNTS.VERIFY_OTP, data);
  return response.data; 
};