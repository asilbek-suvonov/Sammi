import { useState } from 'react'
import { CourseCard } from '@/components/cards/course-card'
import { SectionHeader } from '@/components/landing/section-header'
import { SignInDialog } from '@/components/public/sign-in-dialog'
import { PageLoader } from '@/components/shared/loader'
import { useIsAuthed } from '@/stores/selectors'
import { useCourses } from '@/api-hooks/course/use-courses'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function CoursesSection() {
  const { t } = useTranslation()
  const isAuthed = useIsAuthed()
  const navigate = useNavigate()
  const [signInOpen, setSignInOpen] = useState(false)

  const { data: courses = [], isLoading } = useCourses()

  const handleViewAll = () => {
    if (isAuthed) {
      navigate({ to: '/dashboard/courses' })
    } else {
      setSignInOpen(true)
    }
  }

  if (isLoading) return <PageLoader />


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