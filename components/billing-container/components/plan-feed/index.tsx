import axios from 'axios'
import React from 'react'

import { Box, SimpleGrid, Skeleton } from '@chakra-ui/react'
import { PlanPriceInterval } from '@prisma/client'
import { PlanFeedCard } from './components/plan-feed-card'
import { PlanFeedHeader } from './components/plan-feed-header'
import { getStripe } from '../../../../utils/get-stripe'
import { trpc } from '../../../../../../utils/trpc'

export function PlanFeed(): React.ReactElement {
  const [period, setPeriod] = React.useState<PlanPriceInterval>('month')

  const { data, isLoading } = trpc.getPlans.useQuery()

  const handlePeriodChange = (period: PlanPriceInterval) => {
    setPeriod(period)
  }

  const handleUpgradePlan = async (priceId: string) => {
    try {
      const {
        data: { sessionId }
      } = await axios.post('/api/subscriptions/create-checkout-session', {
        price: priceId
      })

      const stripe = await getStripe()
      stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      return alert((error as Error)?.message)
    }
  }

  return (
    <Box as="section">
      <PlanFeedHeader period={period} onPeriodChange={handlePeriodChange} />

      {isLoading && (
        <SimpleGrid spacing="4">
          <Skeleton height="90px" opacity={0.1} borderRadius="md" />
          <Skeleton height="90px" opacity={0.1} borderRadius="md" />
          <Skeleton height="90px" opacity={0.1} borderRadius="md" />
          <Skeleton height="90px" opacity={0.1} borderRadius="md" />
        </SimpleGrid>
      )}

      {!isLoading &&
        data?.map(plan => (
          <PlanFeedCard
            key={plan.id}
            plan={plan as any}
            period={period}
            onUpgradePlan={handleUpgradePlan}
          />
        ))}
    </Box>
  )
}
