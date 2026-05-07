// 1. Kurs darajalari uchun enum
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

// 2. Kursning asosiy modeli (GET so'rovlari va Response uchun)
export interface ICourse {
  id: number;
  title: string;
  description: string;
  image_url: string;
  preview_video_url_full: string;
  category_name: string;
  technologies_list: string[];
  level: CourseLevel;
  price: string; // API-dan decimal string ko'rinishida keladi
  is_published: boolean;
}
export interface ICourseDelete {
  id: number;
 
}

// 3. Kurs yaratish uchun (POST /course/) - Skrinshotdagi Request Body asosida
export interface ICourseCreate {
  title: string;          // required
  description: string;    // required
  image: File | Blob;     // string($binary)
  preview_video?: File | Blob; // string($binary)
  category: number;       // required (integer)
  technologies?: number[]; // [1, 2, 3] ko'rinishida
  level?: CourseLevel;
  price?: number;
  is_published?: boolean;
}

// 4. Kursni yangilash uchun (PATCH /course/{id}/) - Barcha maydonlar optional
export interface ICoursePatch {
  title?: string;
  description?: string;
  image?: string; // Skrinshotda Patch uchun string($uri) ko'rsatilgan
  preview_video?: string;
  category?: number;
  technologies?: number[];
  level?: CourseLevel;
  price?: string; // string($decimal)
  is_published?: boolean;
}

// 5. Kurslar ro'yxati (Pagination Response)
export interface ICourseListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ICourse[];
}

// 6. Qidiruv va filtr parametrlari (Query Parameters)
export interface ICourseQueryParams {
  ordering?: string;
  page?: number;
  search?: string;
}