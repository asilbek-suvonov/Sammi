// src/api/endpoints.ts

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/login/',
    AUTH_GOOGLE: '/auth/google/',
  },
  COURSES: {
    LIST: '/course/list',
  },
} as const;
