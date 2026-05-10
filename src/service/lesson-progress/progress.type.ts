/**
 * Darsning batafsil ma'lumotlari (GET /lesson-progress/{id}/ ichida keladi)
 */
export interface LessonDetail {
  id: number;
  module: number;
  module_title: string;
  course_title: string;
  title: string;
  video_url: string;
  duration: number;
  duration_formatted: string;
  order: number;
  is_preview: boolean;
}

/**
 * Lesson Progress asosiy modeli
 */
export interface LessonProgress {
  id: number;
  lesson: number | LessonDetail; // Kontekstga qarab ID yoki LessonDetail obyekti
  lesson_title?: string;
  module_title?: string;
  course_title?: string;
  is_completed: boolean;
  watched_at?: string; // ISO Date string (ba'zi javoblarda keladi)
}

/**
 * GET /lesson-progress/list/ - Ro'yxat javob formati
 */
export interface LessonProgressListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: LessonProgress[];
}

/**
 * POST /lesson-progress/ va PUT/PATCH /lesson-progress/{id}/
 * So'rov yuborish uchun model
 */
export interface LessonProgressRequest {
  lesson: number; // Dars ID raqami
  is_completed: boolean;
}

/**
 * GET/POST/PUT/PATCH natijasida qaytadigan qisqa progress modeli
 */
export interface LessonProgressShortResponse {
  id: number;
  lesson: number;
  is_completed: boolean;
}

/**
 * Query parametrlari
 */
export interface LessonProgressQueryParams {
  ordering?: string;
  page?: number;
  search?: string;
}
