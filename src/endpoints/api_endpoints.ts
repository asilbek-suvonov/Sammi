export const API_ENDPOINTS = {
  AUTH: {
    GITHUB: '/auth/github/',
    GOOGLE: '/auth/google/',
    LOGIN: '/login/',
  },

  ACCOUNTS: {
    SEND_OTP: '/send-otp/',
    VERIFY_OTP: '/verify-otp/',
  },

  PROJECTS: {
    LIST: '/projects',
    DETAIL: '/projects/:id',
    DELETE: '/projects/admin/:id/delete',
    UPDATE: '/projects/admin/:id/update',
    PATCH: '/projects/admin/:id/update',
    CREATE: '/projects/admin/create',
    STEP_DETAIL: '/projects/steps/:id',
    STEP_CREATE: '/projects/steps/create',
    STEP_UPDATE: '/projects/steps/:id',
    STEP_PATCH: '/projects/steps/:id',
    STEP_DELETE: '/projects/steps/:id',
    STEP_REORDER: '/projects/steps/reorder',
  },
  CONTACT: {
    CREATE: '/contact/',
    LIST: '/contact/list/',
  },
  PROFILE: {
    CREATE: '/settings/change-password/',
    GET: '/settings/profile/',
    UPDATE: '/settings/profile/',
    PATCH: '/settings/profile/',
  },
  REVIEW: {
    LIST: '/review/list',
    CREATE: '/review',
    UPDATE: '/review/:id',
    PATCH: '/review/:id',
    DELETE: '/review/delete/:id',
    DETAIL: '/review/detail/:id',
  },
  REFRESH: {
    TOKEN: '/refresh/',
  },

  SOURCE_CODES: {
    LIST: '/source-codes/',
    CREATE: '/source-codes/',
    DETAIL: '/source-codes/:slug/',
    UPDATE: '/source-codes/:slug/',
    PATCH: '/source-codes/:slug/',
    DELETE: '/source-codes/:slug/',
  },

  TECHNOLOGY: {
    LIST: '/technology/list',
    CREATE: '/technology/',
    UPDATE: '/technology/:id/',
    PATCH: '/technology/:id/',
    DELETE: '/technology/delete/:id/',
    DETAIL: '/technology/detail/:id/',
  },

  CATEGORY: {
    CREATE: '/category/',
    UPDATE: '/category/:id/',
    PATCH: '/category/:id/',
    DELETE: '/category/delete/:id/',
    DETAIL: '/category/detail/:id/',
    LIST: '/category/list',
  },

  COURSE: {
    CREATE: '/course/',
    UPDATE: '/course/:id/',
    PATCH: '/course/:id/',
    DELETE: '/course/delete/:id/',
    DETAIL: '/course/detail/:id/',
    LIST: '/course/list',
  },

  LESSON_PROGRESS: {
    CREATE: '/lesson-progress/',
    DETAIL: '/lesson-progress/:id/',
    UPDATE: '/lesson-progress/:id/',
    PATCH: '/lesson-progress/:id/',
    LIST: '/lesson-progress/list',
  },
  MODULES: {
    LIST: '/modules/list',
    DETAIL: '/modules/detail/:id/',
    DELETE: '/modules/delete/:id/',
    UPDATE: '/modules/:id/',
    PATCH: '/modules/:id/',
    CREATE: '/modules/',
  },
  LESSON: {
    CREATE: '/lessons/',
    UPDATE: '/lessons/:id/',
    PATCH: '/lessons/:id/',
    DELETE: '/lessons/delete/:id/',
    DETAIL: '/lessons/detail/:id/',
    LIST: '/lessons/list',
  },
} as const

export default API_ENDPOINTS
