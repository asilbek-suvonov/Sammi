// --- Refresh Token Types ---

/**
 * POST /refresh/ so'rovi uchun body
 */
export interface RefreshTokenRequest {
  refresh: string;
}

/**
 * POST /refresh/ muvaffaqiyatli javobi (200 OK)
 */
export interface RefreshTokenResponse {
  access: string;
  refresh: string;
}

