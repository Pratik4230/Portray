import { ProjectDetail } from "@/components/dashboard/project-detail"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function DashboardProjectPage({ params }: PageProps) {
  const { id } = await params
  return <ProjectDetail projectId={id} />
}
