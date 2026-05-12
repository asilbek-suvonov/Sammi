/**
 * Contact API uchun barcha interfeyslar
 */

// 1. Asosiy kontakt modeli
export interface IContact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string; // ISO 8601 formatidagi sana
}

// 2. GET /contact/list/ so'rovi uchun Query parametrlari
export interface IContactQueryParams {
  ordering?: string; // Saralash maydoni
  page?: number;     // Sahifa raqami
  search?: string;   // Qidiruv kalit so'zi
}

// 3. GET /contact/list/ so'rovi uchun javob (Response) strukturasi
export interface IContactListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IContact[];
}

// 4. POST /contact/ so'rovi uchun yuboriladigan ma'lumotlar (Request Body)
export interface ICreateContactRequest {
  name: string;
  email: string;
  message: string;
}