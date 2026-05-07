import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useCourse } from '@/api-hooks/course/use-courses'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'
import { DashboardBreadcrumb } from '@/components/layout/dashboard-breadcrumb'
import { ModulesSection } from '@/components/shared/modules-section'

interface AdminCourseDetailProps {
  id: string
}

export function AdminCourseDetail({ id }: AdminCourseDetailProps) {
  const { data: course, isLoading } = useCourse(id)

  if (isLoading) {
    return (
      <Main>
        <div className='py-12 text-center text-sm text-muted-foreground'>Yuklanmoqda...</div>
      </Main>
    )
  }

  if (!course) {
    return (
      <Main>
        <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center'>
          <h1 className='text-2xl font-semibold'>Course not found</h1>
          <p className='text-sm text-muted-foreground'>
            The course you are looking for does not exist or has been removed.
          </p>
          <Button asChild>
            <Link to='/dashboard/courses'>
              <ArrowLeft className='mr-2 size-4' />
              Back to courses
            </Link>
          </Button>
        </div>
      </Main>
    )
  }

  return (
    <Main>
      <DashboardBreadcrumb
        className='mb-4'
        items={[
          { label: 'Dashboard', to: '/dashboard/overview' },
          { label: 'Courses', to: '/dashboard/courses' },
          { label: course.title },
        ]}
      />

      <div className='flex min-w-0 items-start gap-4'>
        {course.image_url && (
          <img
            src={course.image_url}
            alt={course.title}
            className='h-full w-[200px] shrink-0 rounded-md border object-cover'
          />
        )}
        <div className='min-w-0 space-y-2'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='outline' className='capitalize'>{course.level}</Badge>
            {course.category_name && <Badge variant='secondary'>{course.category_name}</Badge>}
            {course.is_free && <Badge>Free</Badge>}
            {course.is_new && <Badge>New</Badge>}
          </div>
          <h1 className='truncate text-2xl font-bold tracking-tight'>{course.title}</h1>
          <p className='line-clamp-3 max-w-2xl text-sm text-muted-foreground'>{course.description}</p>
        </div>
      </div>

      <Separator className='my-6' />

      

      {course.preview_video_url_full && (
        <div className='mt-4'>
          <Card>
            <CardHeader><CardTitle className='text-base'>Preview</CardTitle></CardHeader>
            <CardContent>
              <div className='aspect-video overflow-hidden rounded-md border'>
                <video src={course.preview_video_url_full} controls className='h-full w-full object-cover' />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <ModulesSection />
    </Main>
  )
}
