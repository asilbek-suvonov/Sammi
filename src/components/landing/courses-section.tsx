import { CourseCard } from '@/components/cards/course-card'
import { SectionHeader } from '@/components/landing/section-header'
import { useAdminStore } from '@/stores/admin-store'
import { useTranslation } from 'react-i18next'

export function CoursesSection() {
  const { t } = useTranslation()
  const { courses } = useAdminStore()

  return (
    <section id='courses' className='space-y-6'>
      <SectionHeader
        title={t('coursesTitle')}
        subtitle={t('coursesSubtitle')}
        showAll={t('coursesAll')}
        seeAllTo='/dashboard/courses'
      />
      <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
        {courses.slice(0, 6).map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  )
}
