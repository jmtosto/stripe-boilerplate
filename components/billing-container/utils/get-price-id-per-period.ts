import { PlanPriceInterval } from '@prisma/client'
import { Plan } from '../components/plan-feed/types/plan'

export function getPlanPriceIdPerPeriod(
  plan: Plan,
  period: PlanPriceInterval
): string {
  if (plan.name === 'NotifyLog - Free') {
    return plan.prices[0].externalId || ''
  }

  const price = plan.prices.find(price => price.interval === period)

  if (!price || !price.externalId) {
    return ''
  }

  return price.externalId
}
