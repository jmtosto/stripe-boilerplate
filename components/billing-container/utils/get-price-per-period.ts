import { PlanPriceInterval } from '@prisma/client'
import { Plan } from '../components/plan-feed/types/plan'

export function getPlanPricePerPeriod(
  plan: Plan,
  period: PlanPriceInterval
): string {
  const price = plan.prices.find(price => price.interval === period)

  if (!price || price.unitAmount === null) {
    return 'R$ 0.00'
  }

  const priceParsed = price.unitAmount / 100
  return priceParsed.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}
