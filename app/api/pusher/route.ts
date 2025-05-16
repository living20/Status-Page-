import { NextResponse } from 'next/server'
import { triggerPusherEvent } from '@/lib/pusher'
import { getAuth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const { userId } = getAuth(req)
  const { channel, event, data } = await req.json()

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    await triggerPusherEvent(channel, event, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to trigger Pusher event' },
      { status: 500 }
    )
  }
}