/**
 * SHARED / COMMON TYPES
 */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Technology {
  id: number;
  name: string;
}

export interface Feature {
  id: number;
  text: string;
  order: number;
}

export interface Step {
  id: number;
  project: number;
  title: string;
  video_url: string;
  duration: number; // sekundlarda
  order: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * PROJECT INTERFACES
 */

// Loyihaning qisqacha ko'rinishi (List view uchun)
export interface ProjectListItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  difficulty: Difficulty;
  difficulty_display: string;
  github_url: string;
  demo_url: string;
  technologies: Technology[];
  created_at: string; // ISO Date string
  total_steps: number;
  total_duration_str: string;
}

// Loyihaning to'liq ko'rinishi (Detail view uchun)
export interface ProjectDetail extends ProjectListItem {
  features: Feature[];
  steps: Step[];
  is_published: boolean;
}

/**
 * REQUEST BODIES (POST / PATCH / PUT)
 */

// Loyiha yaratish va tahrirlash uchun (Multipart/form-data bo'lishi mumkin)
export interface ProjectRequest {
  title: string;
  description: string;
  image?: File | string; // binary upload yoki URL
  difficulty: Difficulty;
  github_url?: string;
  demo_url?: string;
  technologies: number[]; // ID lar massivi
  is_published?: boolean;
}

// Step (qadam) yaratish uchun
export interface StepRequest {
  title: string;
  description: string;
  image?: File | string;
  difficulty?: string;
  github_url?: string;
  demo_url?: string;
  technologies: number[];
  is_published?: boolean;
}

/**
 * QUERY PARAMETERS (API Filters)
 */
export interface ProjectFilters {
  difficulty?: Difficulty;
  ordering?: 'created_at' | '-created_at' | 'title' | '-title';
  page?: number;
  page_size?: number;
  search?: string;
  technologies?: number | number[];
}