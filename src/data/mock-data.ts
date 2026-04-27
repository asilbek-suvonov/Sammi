export interface Source {
  title: string
  description: string
  href: string
  stars: number
}

export const SOURCES: Source[] = [
  { title: 'Landing Repository', description: 'Responsive landing page source code', href: 'https://github.com', stars: 214 },
  { title: 'Dashboard Repository', description: 'Admin panel with role-based access', href: 'https://github.com', stars: 389 },
  { title: 'UI Components Repository', description: 'Shared shadcn/ui component library', href: 'https://github.com', stars: 157 },
]

export interface Lesson {
  id: string
  title: string
  duration: string
  videoUrl?: string
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description: string
  image: string
  parts: number
  hours: number
  price: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  students: number
  rating: number
  instructor: string
  modules: Module[]
  preview_video_url?: string
  category?: string
  technologies?: string[]
  language?: 'uz' | 'en' | 'ru'
  is_free?: boolean
  is_new?: boolean
  is_published?: boolean
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  tech: string[]
  type: string
  price: string
  students: number
  features: string[]
  modules: number
  duration: string
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  github_url?: string
  demo_url?: string
  is_published?: boolean
}

export const COURSES: Course[] = [
  // ─── Extra courses (id 6-11) come first so landing shows them in the mix ─
  {
    id: '6',
    title: 'Node.js Backend',
    description: 'Build scalable REST APIs and microservices with Node.js, Express, and modern backend patterns including authentication, file uploads, and WebSockets.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
    parts: 11, hours: 30, price: '$129', level: 'Intermediate', students: 870, rating: 4.8,
    instructor: 'Asilbek Karimov',
    category: 'Backend', is_new: true, is_published: true,
    modules: [
      { id: 'm1', title: 'Express Fundamentals', lessons: [
        { id: 'l1', title: 'Routing and Middleware', duration: '18:00' },
        { id: 'l2', title: 'Error Handling', duration: '15:30' },
      ]},
      { id: 'm2', title: 'Database Integration', lessons: [
        { id: 'l3', title: 'MongoDB with Mongoose', duration: '24:00' },
        { id: 'l4', title: 'PostgreSQL with Prisma', duration: '22:00' },
      ]},
    ],
  },
  {
    id: '7',
    title: 'GraphQL API Design',
    description: 'Design and implement production-grade GraphQL APIs with Apollo Server, schema design, resolvers, subscriptions, and performance optimization.',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=800&auto=format&fit=crop',
    parts: 8, hours: 22, price: '$119', level: 'Advanced', students: 540, rating: 4.7,
    instructor: 'Asilbek Karimov',
    category: 'API', is_new: true, is_published: true,
    modules: [
      { id: 'm1', title: 'GraphQL Basics', lessons: [
        { id: 'l1', title: 'Schema Definition Language', duration: '20:00' },
        { id: 'l2', title: 'Resolvers & Context', duration: '18:30' },
      ]},
    ],
  },
  {
    id: '8',
    title: 'Docker & DevOps',
    description: 'Master containerization with Docker, orchestration with Kubernetes, and CI/CD pipelines to ship code faster and more reliably.',
    image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=800&auto=format&fit=crop',
    parts: 10, hours: 28, price: '$109', level: 'Intermediate', students: 690, rating: 4.6,
    instructor: 'Asilbek Karimov',
    category: 'DevOps', is_new: false, is_published: true,
    modules: [
      { id: 'm1', title: 'Docker Fundamentals', lessons: [
        { id: 'l1', title: 'Images and Containers', duration: '22:00' },
        { id: 'l2', title: 'Docker Compose', duration: '19:00' },
      ]},
    ],
  },
  {
    id: '9',
    title: 'Vue.js 3 Mastery',
    description: 'Build modern single-page applications with Vue.js 3, Composition API, Pinia state management, and Vue Router.',
    image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=800&auto=format&fit=crop',
    parts: 9, hours: 26, price: '$99', level: 'Beginner', students: 760, rating: 4.8,
    instructor: 'Asilbek Karimov',
    category: 'Frontend', is_new: true, is_published: true,
    modules: [
      { id: 'm1', title: 'Vue 3 Basics', lessons: [
        { id: 'l1', title: 'Composition API', duration: '20:00' },
        { id: 'l2', title: 'Reactivity System', duration: '16:00' },
      ]},
    ],
  },
  {
    id: '10',
    title: 'PostgreSQL Mastery',
    description: 'Deep dive into PostgreSQL — from advanced queries and indexing strategies to partitioning, replication, and performance tuning for large datasets.',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
    parts: 7, hours: 18, price: '$89', level: 'Intermediate', students: 430, rating: 4.7,
    instructor: 'Asilbek Karimov',
    category: 'Database', is_new: false, is_published: true,
    modules: [
      { id: 'm1', title: 'Advanced SQL', lessons: [
        { id: 'l1', title: 'Window Functions', duration: '18:00' },
        { id: 'l2', title: 'CTEs and Recursive Queries', duration: '20:00' },
      ]},
    ],
  },
  {
    id: '11',
    title: 'AWS Cloud Architecture',
    description: 'Design and deploy scalable cloud solutions on AWS using EC2, S3, Lambda, RDS, CloudFront, and infrastructure as code with Terraform.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    parts: 12, hours: 38, price: '$149', level: 'Advanced', students: 390, rating: 4.9,
    instructor: 'Asilbek Karimov',
    category: 'Cloud', is_new: true, is_published: true,
    modules: [
      { id: 'm1', title: 'AWS Fundamentals', lessons: [
        { id: 'l1', title: 'IAM and Security', duration: '24:00' },
        { id: 'l2', title: 'EC2 and VPC', duration: '28:00' },
      ]},
    ],
  },
  // ─── Original 6 courses ──────────────────────────────────────────────────
  {
    id: '0',
    title: 'Frontend Foundations',
    description:
      'Master the fundamentals of modern frontend development with HTML, CSS, and JavaScript. Build real-world projects from scratch and learn best practices used by professionals.',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    parts: 12,
    hours: 36,
    price: '$149',
    level: 'Beginner',
    students: 1240,
    rating: 4.9,
    instructor: 'Asilbek Karimov',
    category: 'Frontend',
    is_new: false,
    is_published: true,
    modules: [
      {
        id: 'm1',
        title: 'HTML Fundamentals',
        lessons: [
          { id: 'l1', title: 'Introduction to Web Development', duration: '12:00' },
          { id: 'l2', title: 'Semantic HTML Tags', duration: '18:45' },
          { id: 'l3', title: 'Forms and Inputs', duration: '22:10' },
          { id: 'l4', title: 'Tables and Media', duration: '16:30' },
        ],
      },
      {
        id: 'm2',
        title: 'CSS Styling',
        lessons: [
          { id: 'l5', title: 'Selectors and Box Model', duration: '15:30' },
          { id: 'l6', title: 'Flexbox Fundamentals', duration: '25:00' },
          { id: 'l7', title: 'CSS Grid System', duration: '30:15' },
          { id: 'l8', title: 'Animations and Transitions', duration: '19:45' },
        ],
      },
      {
        id: 'm3',
        title: 'JavaScript Basics',
        lessons: [
          { id: 'l9', title: 'Variables and Data Types', duration: '14:20' },
          { id: 'l10', title: 'Functions and Scope', duration: '20:00' },
          { id: 'l11', title: 'DOM Manipulation', duration: '28:40' },
          { id: 'l12', title: 'Events and Callbacks', duration: '22:15' },
        ],
      },
    ],
  },
  {
    id: '1',
    title: 'TypeScript Mastery',
    description:
      'Deep dive into TypeScript – from basic types to advanced generics, decorators, and real-world patterns used in production-grade applications.',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop',
    parts: 10,
    hours: 28,
    price: '$129',
    level: 'Intermediate',
    students: 980,
    rating: 4.8,
    instructor: 'Asilbek Karimov',
    category: 'Language',
    is_new: false,
    is_published: true,
    modules: [
      {
        id: 'm1',
        title: 'TypeScript Basics',
        lessons: [
          { id: 'l1', title: 'Types and Interfaces', duration: '16:00' },
          { id: 'l2', title: 'Union and Intersection Types', duration: '19:30' },
          { id: 'l3', title: 'Type Guards', duration: '14:00' },
        ],
      },
      {
        id: 'm2',
        title: 'Advanced TypeScript',
        lessons: [
          { id: 'l4', title: 'Generics Deep Dive', duration: '24:00' },
          { id: 'l5', title: 'Mapped and Conditional Types', duration: '21:15' },
          { id: 'l6', title: 'Decorators', duration: '18:30' },
          { id: 'l7', title: 'Module Systems', duration: '16:00' },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'React Performance',
    description:
      'Learn advanced React optimization techniques including memoization, virtualization, code splitting, and profiling to build blazing-fast applications.',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    parts: 9,
    hours: 24,
    price: '$119',
    level: 'Advanced',
    students: 750,
    rating: 4.9,
    instructor: 'Asilbek Karimov',
    category: 'Frontend',
    is_new: true,
    is_published: true,
    modules: [
      {
        id: 'm1',
        title: 'React Internals',
        lessons: [
          { id: 'l1', title: 'Reconciliation Algorithm', duration: '20:00' },
          { id: 'l2', title: 'Fiber Architecture', duration: '25:30' },
        ],
      },
      {
        id: 'm2',
        title: 'Optimization Patterns',
        lessons: [
          { id: 'l3', title: 'useMemo and useCallback', duration: '18:00' },
          { id: 'l4', title: 'React.memo', duration: '15:45' },
          { id: 'l5', title: 'Virtualization with react-window', duration: '22:00' },
        ],
      },
      {
        id: 'm3',
        title: 'Code Splitting',
        lessons: [
          { id: 'l6', title: 'Dynamic Imports', duration: '16:30' },
          { id: 'l7', title: 'Lazy Loading', duration: '19:00' },
          { id: 'l8', title: 'Bundle Analysis', duration: '14:20' },
          { id: 'l9', title: 'Profiling Tools', duration: '21:00' },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Next.js Full-Stack',
    description:
      'Build production-ready full-stack applications with Next.js, including server components, API routes, authentication, and database integration.',
    image:
      'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=800&auto=format&fit=crop',
    parts: 14,
    hours: 42,
    price: '$169',
    level: 'Intermediate',
    students: 1540,
    rating: 5.0,
    instructor: 'Asilbek Karimov',
    category: 'Full-Stack',
    is_new: true,
    is_published: true,
    modules: [
      {
        id: 'm1',
        title: 'Next.js Foundations',
        lessons: [
          { id: 'l1', title: 'App Router Architecture', duration: '20:00' },
          { id: 'l2', title: 'Server vs Client Components', duration: '24:30' },
          { id: 'l3', title: 'File-based Routing', duration: '16:00' },
        ],
      },
      {
        id: 'm2',
        title: 'Data Fetching',
        lessons: [
          { id: 'l4', title: 'Server Actions', duration: '22:00' },
          { id: 'l5', title: 'Streaming and Suspense', duration: '19:45' },
          { id: 'l6', title: 'React Query Integration', duration: '25:00' },
        ],
      },
      {
        id: 'm3',
        title: 'Full-Stack Features',
        lessons: [
          { id: 'l7', title: 'Authentication with NextAuth', duration: '30:00' },
          { id: 'l8', title: 'Database with Prisma', duration: '28:15' },
          { id: 'l9', title: 'File Uploads', duration: '18:00' },
          { id: 'l10', title: 'Deployment to Vercel', duration: '20:30' },
        ],
      },
    ],
  },
  {
    id: '4',
    title: 'TanStack Ecosystem',
    description:
      'Master the TanStack ecosystem – Router, Query, Form, Table – and learn to build complex, data-driven applications with confidence.',
    image:
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop',
    parts: 8,
    hours: 20,
    price: '$99',
    level: 'Advanced',
    students: 620,
    rating: 4.7,
    instructor: 'Asilbek Karimov',
    category: 'Frontend',
    is_new: false,
    is_published: true,
    modules: [
      {
        id: 'm1',
        title: 'TanStack Router',
        lessons: [
          { id: 'l1', title: 'Type-safe Routing', duration: '18:00' },
          { id: 'l2', title: 'Loaders and Guards', duration: '22:00' },
        ],
      },
      {
        id: 'm2',
        title: 'TanStack Query',
        lessons: [
          { id: 'l3', title: 'Queries and Mutations', duration: '20:00' },
          { id: 'l4', title: 'Optimistic Updates', duration: '16:30' },
          { id: 'l5', title: 'Infinite Queries', duration: '19:00' },
        ],
      },
    ],
  },
  {
    id: '5',
    title: 'UI Design Systems',
    description:
      'Learn to build scalable, accessible design systems with Tailwind CSS, Radix UI, and component-driven architecture principles.',
    image:
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=800&auto=format&fit=crop',
    parts: 11,
    hours: 32,
    price: '$139',
    level: 'Intermediate',
    students: 890,
    rating: 4.8,
    instructor: 'Asilbek Karimov',
    category: 'Design',
    is_new: false,
    is_published: false,
    modules: [
      {
        id: 'm1',
        title: 'Design Tokens',
        lessons: [
          { id: 'l1', title: 'Color Systems', duration: '16:00' },
          { id: 'l2', title: 'Typography Scale', duration: '14:30' },
          { id: 'l3', title: 'Spacing and Sizing', duration: '12:00' },
        ],
      },
      {
        id: 'm2',
        title: 'Component Architecture',
        lessons: [
          { id: 'l4', title: 'Compound Components', duration: '22:00' },
          { id: 'l5', title: 'Accessibility (a11y)', duration: '25:30' },
          { id: 'l6', title: 'Storybook Integration', duration: '18:00' },
        ],
      },
    ],
  },
]

export const PROJECTS: Project[] = [
  {
    id: '0',
    title: 'SaaS Billing Dashboard',
    description:
      'A complete billing and subscription management dashboard built with React, TanStack Router, and Tailwind. Includes payment history, plan management, and usage analytics.',
    image:
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=800&auto=format&fit=crop',
    tech: ['React', 'TanStack Router', 'Tailwind'],
    type: 'Full-Stack',
    price: '$79',
    students: 420,
    features: ['Payment integration', 'Subscription plans', 'Usage analytics', 'Export reports'],
    modules: 6,
    duration: '18h',
    difficulty: 'Medium',
    github_url: 'https://github.com/sammi-edu/saas-billing',
    demo_url: 'https://demo.sammi.edu/saas-billing',
    is_published: true,
  },
  {
    id: '1',
    title: 'Design System Starter',
    description:
      'A production-ready design system built with TypeScript, Radix UI, and Storybook. Ships with 40+ accessible components, dark mode, and comprehensive documentation.',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
    tech: ['TypeScript', 'Radix UI', 'Storybook'],
    type: 'Frontend',
    price: '$59',
    students: 380,
    features: ['40+ components', 'Dark mode', 'Storybook docs', 'Accessibility'],
    modules: 5,
    duration: '14h',
    difficulty: 'Easy',
    github_url: 'https://github.com/sammi-edu/design-system',
    demo_url: 'https://demo.sammi.edu/design-system',
    is_published: true,
  },
  {
    id: '2',
    title: 'Analytics Portal',
    description:
      'Data visualization portal featuring interactive charts, real-time updates, and filterable dashboards. Built with Recharts, React Query, and Zod for type-safe data fetching.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    tech: ['Recharts', 'React Query', 'Zod'],
    type: 'Data',
    price: '$89',
    students: 290,
    features: ['Real-time charts', 'Data filters', 'CSV export', 'Responsive'],
    modules: 7,
    duration: '22h',
    difficulty: 'Medium',
    github_url: 'https://github.com/sammi-edu/analytics-portal',
    demo_url: 'https://demo.sammi.edu/analytics',
    is_published: true,
  },
  {
    id: '3',
    title: 'E-Commerce Platform',
    description:
      'A full-featured e-commerce platform with product management, cart, checkout with Stripe, and order tracking. Built with Next.js, Prisma, and PostgreSQL.',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop',
    tech: ['Next.js', 'Stripe', 'Prisma'],
    type: 'Full-Stack',
    price: '$119',
    students: 560,
    features: ['Product management', 'Stripe payments', 'Order tracking', 'Admin panel'],
    modules: 9,
    duration: '32h',
    difficulty: 'Hard',
    github_url: 'https://github.com/sammi-edu/ecommerce',
    demo_url: 'https://demo.sammi.edu/shop',
    is_published: true,
  },
  {
    id: '4',
    title: 'Real-time Chat App',
    description:
      'A scalable real-time messaging application with rooms, direct messages, file sharing, and online presence. Built with Socket.io, Redis, and React.',
    image:
      'https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=800&auto=format&fit=crop',
    tech: ['Socket.io', 'Redis', 'React'],
    type: 'Real-time',
    price: '$99',
    students: 340,
    features: ['Real-time messages', 'File sharing', 'Online presence', 'Message history'],
    modules: 8,
    duration: '26h',
    difficulty: 'Medium',
    github_url: 'https://github.com/sammi-edu/realtime-chat',
    demo_url: 'https://demo.sammi.edu/chat',
    is_published: true,
  },
  {
    id: '5',
    title: 'DevOps Dashboard',
    description:
      'Infrastructure monitoring dashboard with Grafana API integration, Docker container management, and deployment pipeline visualization.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    tech: ['Grafana API', 'Docker', 'TypeScript'],
    type: 'DevOps',
    price: '$109',
    students: 180,
    features: ['Container metrics', 'Deployment status', 'Alert management', 'Log viewer'],
    modules: 6,
    duration: '20h',
    difficulty: 'Hard',
    github_url: 'https://github.com/sammi-edu/devops-dashboard',
    is_published: false,
  },
]
