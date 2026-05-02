const API_ENDPOINTS = {
  AUTH: {
    GITHUB: "/auth/github",
    GOOGLE: "/auth/google",
    LOGIN: "/login",
  },

  ACCOUNTS: {
    SEND_OTP: "/send-otp",
    VERIFY_OTP: "/verify-otp",
  },

  PROJECTS: {
    LIST: "/projects",
    DETAIL: "/projects/:id",
    DELETE: "/projects/admin/:id/delete",
    UPDATE: "/projects/admin/:id/update",
    PATCH: "/projects/admin/:id/update",
    CREATE: "/projects/admin/create",
    STEP_DETAIL: "/projects/steps/:id",
    STEP_CREATE: "/projects/steps/create",
  },

  REVIEW: {
    LIST: "/review/list",
    CREATE: "/review",
    UPDATE: "/review/:id",
    PATCH: "/review/:id",
    DELETE: "/review/delete/:id",
    DETAIL: "/review/detail/:id",
  },

  SOURCE_CODES: {
    LIST: "/source-codes/",
    CREATE: "/source-codes/",
    DETAIL: "/source-codes/:slug/",
    UPDATE: "/source-codes/:slug/",
    PATCH: "/source-codes/:slug/",
    DELETE: "/source-codes/:slug/",
  },

  TECHNOLOGY: {
    LIST: "/technology/list",
    CREATE: "/technology",
    UPDATE: "/technology/:id/",
    PATCH: "/technology/:id/",
    DELETE: "/technology/delete/:id/",
    DETAIL: "/technology/detail/:id/",
  },

  CATEGORY: {
    CREATE: "/category",
    UPDATE: "/category/:id/",
    PATCH: "/category/:id/",
    DELETE: "/category/delete/:id/",
    DETAIL: "/category/detail/:id/",
    LIST: "/category/list",
  },

  COURSE: {
    CREATE: "/course",
    UPDATE: "/course/:id/",
    PATCH: "/course/:id/",
    DELETE: "/course/delete/:id/",
    DETAIL: "/course/detail/:id/",
    LIST: "/course/list",
  },

  ENROLLMENT: {
    CREATE: "/enrollment",
    DETAIL: "/enrollment/:id/",
    DELETE: "/enrollment/delete/:id/",
    LIST: "/enrollment/list",
  },

  LESSON_PROGRESS: {
    CREATE: "/lesson-progress/",
    DETAIL: "/lesson-progress/:id/",
    UPDATE: "/lesson-progress/:id/",
    PATCH: "/lesson-progress/:id/",
    LIST: "/lesson-progress/list",
  },
} as const;
