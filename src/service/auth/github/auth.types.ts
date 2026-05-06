export interface GithubAuthRequest {
  access_token: string;
}

export interface GithubAuthResponse {
  id: number;
  email: string;
  full_name: string;
  avatar_url: string;
  country: string;
  language_code: string;
  created_at: string;
  is_new_user: boolean;
  access?: string; // JWT token
  refresh?: string; // Refresh token
}