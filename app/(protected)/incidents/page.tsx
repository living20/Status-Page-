import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import IncidentsTable from '@/components/incidents-table'
import CreateIncidentButton from '@/components/create-incident-button'

export default async function IncidentsPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
    include: {
      organizations: {
        include: {
          incidents: {
            include: {
              services: true,
              updates: { orderBy: { createdAt: 'desc' }, take: 1 },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      },
    },
  })

  if (!dbUser || !dbUser.organizations.length) {
    redirect('/create-organization')
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Incidents</h1>
        <CreateIncidentButton services={dbUser.organizations[0].services} />
      </div>
      <IncidentsTable incidents={dbUser.organizations[0].incidents} />
    </div>
  )
}