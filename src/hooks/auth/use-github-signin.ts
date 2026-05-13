import { toast } from 'sonner'

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'
const GITHUB_STATE_KEY = 'sammi_github_oauth_state'

export function useGithubSignIn() {
  const start = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID as string | undefined
    if (!clientId) {
      toast.error("GitHub kirish sozlanmagan (VITE_GITHUB_CLIENT_ID yo'q).")
      return
    }

    const state =
      Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem(GITHUB_STATE_KEY, state)

    const redirectUri = `${window.location.origin}/auth/github/callback`
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'read:user user:email',
      state,
    })

    window.location.assign(`${GITHUB_AUTHORIZE_URL}?${params.toString()}`)
  }

  return { start }
}
