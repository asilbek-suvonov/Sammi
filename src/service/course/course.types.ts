export interface Course {
  id: number;
  title: string;
  description: string;
  image_url: string;
  preview_video_url_full: string;
  preview_video_url: string;
  category_name: string;
  technologies_list: string[];
  level: 'beginner' | 'intermediate' | 'advanced'; // backenddan kelayotgan qiymatga qarab
  price: string;
  is_free: boolean;
  is_new: boolean;
}

export interface CourseListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Course[];
}