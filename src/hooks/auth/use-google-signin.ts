import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { googleAuth } from '@/service/auth'
import { useAuthStore } from '@/stores/auth-store'

export function useGoogleSignIn(onDone?: () => void) {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.auth.login)
  const [signingIn, setSigningIn] = useState(false)

  const handleSuccess = async (credential: string) => {
    setSigningIn(true)
    try {
      const data = await googleAuth({ token: credential })
      if (data?.access) {
        login({
          accessToken: data.access,
          refreshToken: data.refresh ?? '',
          user: {
            id: data.id,
            email: data.email,
            fullName: data.full_name,
            avatarUrl: data.avatar_url,
            role: 'user'
          }
        })
        toast.success("Muvaffaqiyatli kirdingiz!")
        onDone?.()
        navigate({ to: '/dashboard' })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSigningIn(false)
    }
  }

  // Faqat handleSuccess va signingIn qaytarilmoqda
  return { handleSuccess, signingIn }
}