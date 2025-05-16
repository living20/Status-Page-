import { prisma } from '@/lib/db'
import PublicStatusView from '@/components/public-status-view'

export default async function PublicStatusPage({
  params,
}: {
  params: { orgSlug: string }
}) {
  const organization = await prisma.organization.findUnique({
    where: { slug: params.orgSlug },
    include: {
      services: true,
      incidents: {
        where: { status: { not: 'Resolved' } },
        include: { services: true, updates: true },
      },
    },
  })

  if (!organization) {
    return <div>Organization not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicStatusView 
        organization={organization} 
        services={organization.services} 
        incidents={organization.incidents} 
      />
    </div>
  )
}