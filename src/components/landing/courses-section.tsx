import { useState } from 'react'
import { CourseCard } from '@/components/cards/course-card'
import { SectionHeader } from '@/components/landing/section-header'
import { SignInDialog } from '@/components/public/sign-in-dialog'
import { useAdminStore } from '@/stores/admin-store'
import { useAuthStore } from '@/stores/auth-store'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function CoursesSection() {
  const { t } = useTranslation()
  const { courses } = useAdminStore()
  const { auth } = useAuthStore()
  const navigate = useNavigate()
  const [signInOpen, setSignInOpen] = useState(false)

  const handleViewAll = () => {
    if (auth.accessToken) {
      navigate({ to: '/dashboard/courses' })
    } else {
      setSignInOpen(true)
    }
  }

  return (
    <>
      <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />
      <section id='courses' className='space-y-6'>
        <SectionHeader
          title={t('coursesTitle')}
          subtitle={t('coursesSubtitle')}
          showAll={t('coursesAll')}
          onSeeAll={handleViewAll}
        />
        <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
          {courses.slice(0, 6).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </>
  )
}
