'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Service, Status } from '@prisma/client'

const statusMap: Record<Status, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  Operational: { label: 'Operational', variant: 'default' },
  DegradedPerformance: { label: 'Degraded', variant: 'secondary' },
  PartialOutage: { label: 'Partial Outage', variant: 'destructive' },
  MajorOutage: { label: 'Major Outage', variant: 'destructive' },
  Maintenance: { label: 'Maintenance', variant: 'outline' },
}

export default function ServiceStatusCard({ service }: { service: Service }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{service.name}</CardTitle>
        <Badge variant={statusMap[service.status].variant}>
          {statusMap[service.status].label}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          {service.description || 'No description provided'}
        </p>
      </CardContent>
    </Card>
  )
}