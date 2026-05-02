import { useState } from 'react'
import { CourseCard } from '@/components/cards/course-card'
import { SectionHeader } from '@/components/landing/section-header'
import { SignInDialog } from '@/components/public/sign-in-dialog'
import { useAccessToken } from '@/stores/selectors' // AccessToken qolsin
import { useCourses } from '../../hooks/course/use-courses'    // Biz yozgan yangi hook
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function CoursesSection() {
  const { t } = useTranslation()
  const accessToken = useAccessToken()
  const navigate = useNavigate()
  const [signInOpen, setSignInOpen] = useState(false)

  // Yangi hookni chaqiramiz
  const { data, isLoading } = useCourses()

  const handleViewAll = () => {
    if (accessToken) {
      navigate({ to: '/dashboard/courses' })
    } else {
      setSignInOpen(true)
    }
  }

  // Yuklanayotgan vaqtda skeleton yoki bo'sh joy ko'rsatish
  if (isLoading) return <div className="h-40 flex items-center justify-center">Yuklanmoqda...</div>

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
          {/* data.results ichidan birinchi 6 tasini olamiz */}
          {data?.results.slice(0, 6).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </>
  )
}