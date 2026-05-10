import api from '@/api'
import API_ENDPOINTS from '@/endpoints/api_endpoints'
import type { GoogleAuthRequest, GoogleAuthResponse } from './auth.types'

export const googleAuth = async (data: GoogleAuthRequest): Promise<GoogleAuthResponse> => {
  // Backend "token" kalit so'zi bilan JWT kutayotgan bo'lishi mumkin
  // Lekin sizdagi xatoga ko'ra, u "ya29..." formatini xato deb hisoblayapti.
  // Shuning uchun biz ham "token", ham "access_token" variantlarini sinab ko'ramiz
  try {
    return await api.post<GoogleAuthResponse>(API_ENDPOINTS.AUTH.GOOGLE, {
      token: data.token,
    })
  } catch (error: any) {
    // Agar 400 xatosi aynan token formati tufayli bo'lsa (Wrong number of segments),
    // backend kutilmagan formatda "access_token" sifatida qabul qilishi mumkin:
    if (error?.response?.status === 400) {
      return await api.post<GoogleAuthResponse>(API_ENDPOINTS.AUTH.GOOGLE, {
        access_token: data.token,
      })
    }
    throw error
  }
}