import { ProjectCard } from '@/components/cards/project-card'
import { SectionHeader } from '@/components/landing/section-header'
import { useAdminStore } from '@/stores/admin-store'
import { useTranslation } from 'react-i18next'

export function ProjectsSection() {
  const { t } = useTranslation()
  const { projects } = useAdminStore()

  return (
    <section id='projects' className='space-y-6'>
      <SectionHeader
        title={t('projectsTitle')}
        subtitle={t('projectsSubtitle')}
        showAll={t('projectsAll')}
        seeAllTo='/dashboard/projects'
      />
      <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
        {projects.slice(0, 6).map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
