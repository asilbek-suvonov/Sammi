/**
 * Umumiy Kurs ma'lumotlari interfeysi (GET /enrollment/{id}/ uchun)
 */
export interface CourseDetail {
  id: number;
  title: string;
  description: string;
  image_url: string;
  preview_video_url_full: string;
  category_name: string;
  technologies_list: string[];
  level: "beginner" | "intermediate" | "advanced" | string;
  price: string;
  rating: number;
  reviews_count: number;
  lessons_count: number;
  modules_count: number;
}

/**
 * Enrollment (Ro'yxatdan o'tish) asosiy modeli
 */
export interface Enrollment {
  id: number;
  course: number | CourseDetail; // Kontekstga qarab ID yoki obyekt bo'lishi mumkin
  course_title?: string;
  course_image?: string;
  enrolled_at: string; // ISO Date string
  progress_percentage: number;
  completed_lessons?: number;
}

/**
 * GET /enrollment/list/ - Paginated javob qaytarish formati
 */
export interface EnrollmentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Enrollment[];
}

/**
 * POST /enrollment/ - Yangi enrollment yaratish uchun so'rov tanasi
 */
export interface CreateEnrollmentRequest {
  course: number; // Kurs ID raqami
}

/**
 * POST /enrollment/ - Yaratilgandagi javob formati
 */
export interface CreateEnrollmentResponse {
  id: number;
  course: number;
}

/**
 * API Query parametrlari (Filtrlash va Pagination uchun)
 */
export interface EnrollmentQueryParams {
  ordering?: string;
  page?: number;
  search?: string;
}