import { PlanPriceInterval, PlanPriceType } from '@prisma/client'

export type Plan = {
  name: string
  id: string
  quota: {
    rooms: number
    reservations: number
  }
  prices: {
    type: PlanPriceType
    currency: string
    interval: PlanPriceInterval
    id?: string
    externalId?: string
    intervalCount?: number | null
    unitAmount: number | null
  }[]
}
