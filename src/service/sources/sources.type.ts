
// Asosiy Source Code obyekti
export interface SourceCode {
  id: number;
  title: string;
  slug: string;
  github_url: string;
  is_published: boolean;
  created_at: string; // ISO Date string
}

// POST, PUT so'rovlari uchun (Yaratish va to'liq yangilash)
export interface SourceCodeCreateUpdate {
  title: string;
  github_url: string;
}

// PATCH so'rovlari uchun (Qisman yangilash)
export interface SourceCodePartialUpdate {
  title?: string;
  github_url?: string;
}

// GET /source-codes/ (Pagination bilan ro'yxatni olish)
export interface SourceCodeListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SourceCode[];
}

// Query parametrlar uchun (Filtr va qidiruv)
export interface SourceCodeQueryParams {
  ordering?: string;
  page?: number;
  search?: string;
}

// URL parametrlari uchun
export interface SourceCodePathParams {
  slug: string;
}

