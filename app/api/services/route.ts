import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuth } from '@clerk/nextjs/server'

export async function GET(req: Request) {
  const { userId } = getAuth(req)

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { organizations: true },
  })

  if (!user || !user.organizations.length) {
    return new NextResponse('No organization found', { status: 400 })
  }

  const services = await prisma.service.findMany({
    where: { organizationId: user.organizations[0].id },
  })

  return NextResponse.json(services)
}

export async function POST(req: Request) {
  const { userId } = getAuth(req)
  const { name, description } = await req.json()

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { organizations: true },
  })

  if (!user || !user.organizations.length) {
    return new NextResponse('No organization found', { status: 400 })
  }

  const service = await prisma.service.create({
    data: {
      name,
      description,
      organizationId: user.organizations[0].id,
    },
  })

  return NextResponse.json(service)
}