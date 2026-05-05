import { useEffect } from 'react'

export function GithubCallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    const error = params.get('error_description') || params.get('error')

    if (window.opener) {
      window.opener.postMessage(
        { source: 'sammi-github-oauth', code, state, error },
        window.location.origin
      )
      window.close()
      return
    }

    if (code) {
      sessionStorage.setItem('sammi_github_code', code)
      window.location.replace('/')
    }
  }, [])

  return (
    <div className='flex min-h-screen items-center justify-center text-sm text-muted-foreground'>
      Completing GitHub sign-in…
    </div>
  )
}
