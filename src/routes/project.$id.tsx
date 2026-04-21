import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/project/$id')({
  component: ProjectComponent,
  loader: async ({ params }) => {
    console.log('Loyiha ID:', params.id)
    return { id: params.id }
  },
})

function ProjectComponent() {
  const { id } = Route.useParams()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Loyiha Sahifasi</h1>
      <p>Loyiha ID: <span className="font-mono text-green-600">{id}</span></p>
    </div>
  )
}