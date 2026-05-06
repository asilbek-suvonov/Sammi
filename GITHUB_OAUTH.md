Setup: GitHub OAuth for Sammi

1) Create OAuth App on GitHub
- Settings → Developer settings → OAuth Apps → New OAuth App
- Application name: sammi
- Homepage URL: http://localhost:5173/ (or your production homepage)
- Authorization callback URL: set this to the exact backend/frontend callback you will use.
  - For backend exchange: https://your-backend.example.com/api/auth/callback/github
  - For frontend catcher (dev): http://localhost:5173/api/auth/callback/github

2) Client ID / Secret
- Copy the Client ID into `.env` as `VITE_GITHUB_CLIENT_ID`.
- Do NOT commit the client secret into the frontend repo.

3) Recommended flows
- Backend exchange (recommended for production):
  - GitHub redirects to your backend callback URL.
  - Backend exchanges `code` for access token and returns a secure session (cookie) or JWT.
  - In this repo the frontend will send `code` to `POST /auth/github/` which should perform exchange.

- Frontend catcher (developer-friendly):
  - GitHub redirects to frontend route `/api/auth/callback/github`.
  - Frontend catcher reads `code` and posts to backend `POST /auth/github/` to finish auth.

4) Environment (.env)
- Copy `.env.example` → `.env` and set `VITE_API_BASE_URL` and `VITE_GITHUB_CLIENT_ID`.
- Leave `VITE_GITHUB_CALLBACK_URL` unset to let GitHub use the app's registered callback URL.

5) Run locally
```bash
pnpm install
pnpm run dev
```

6) Troubleshooting
- Error: "The redirect_uri is not associated with this application" → ensure the exact URL (scheme, host, port, path) is registered in GitHub OAuth App.
- 404 after redirect → ensure callback route exists in frontend or backend depending on flow.
- 500 → check backend logs and response body; frontend will display error toast and console.error.
