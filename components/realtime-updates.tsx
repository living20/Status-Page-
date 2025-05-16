'use client'

import { useEffect } from 'react'
import Pusher from 'pusher-js'
import { useRouter } from 'next/navigation'

export default function RealtimeUpdates({
  channelName,
}: {
  channelName: string
}) {
  const router = useRouter()

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })

    const channel = pusher.subscribe(channelName)

    channel.bind('status-update', () => {
      router.refresh()
    })

    channel.bind('incident-update', () => {
      router.refresh()
    })

    return () => {
      pusher.unsubscribe(channelName)
    }
  }, [channelName, router])

  return null
}