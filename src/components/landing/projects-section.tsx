import { useState } from 'react'
import { ProjectCard } from '@/components/cards/project-card'
import { SectionHeader } from '@/components/landing/section-header'
import { SignInDialog } from '@/components/public/sign-in-dialog'
import { useAccessToken, useProjects } from '@/stores/selectors'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function ProjectsSection() {
  const { t } = useTranslation()
  const projects = useProjects()
  const accessToken = useAccessToken()
  const navigate = useNavigate()
  const [signInOpen, setSignInOpen] = useState(false)

  const handleViewAll = () => {
    if (accessToken) {
      navigate({ to: '/dashboard/projects' })
    } else {
      setSignInOpen(true)
    }
  }

  return (
    <>
      <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />
      <section id='projects' className='space-y-6'>
        <SectionHeader
          title={t('projectsTitle')}
          subtitle={t('projectsSubtitle')}
          showAll={t('projectsAll')}
          onSeeAll={handleViewAll}
        />
        <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
          {projects.slice(0, 6).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </>
  )
}
