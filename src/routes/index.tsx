/* eslint-disable react-refresh/only-export-components */
import { LandingPage } from '@/features/landing/landing-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: LandingPage,
})
