import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import DashboardOverview from '@/components/dashboard-overview'

export default async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
    include: {
      organizations: {
        include: {
          services: true,
          incidents: {
            where: { status: { not: 'Resolved' } },
            include: { services: true },
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
      <DashboardOverview 
        services={dbUser.organizations[0].services} 
        incidents={dbUser.organizations[0].incidents} 
      />
    </div>
  )
}