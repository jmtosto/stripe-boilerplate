import { Flex, HStack, Text } from '@chakra-ui/react'
import { PlanPriceInterval } from '@prisma/client'
import { Card, CardBody } from '@saas-ui/react'
import React from 'react'
import { Plan } from '../../types/plan'
import { getPlanPriceIdPerPeriod } from '../../../../utils/get-price-id-per-period'
import { getPlanPricePerPeriod } from '../../../../utils/get-price-per-period'
import { parsePlanName } from '../../../../utils/parse-plan-name'
import { parseQuota } from '../../../../utils/parse-quota'
import { periodLabels } from '../../../../../../data/period'

export function PlanFeedCard({
  plan,
  period,
  isActive,
  onUpgradePlan
}: {
  isActive?: boolean
  plan: Plan
  period: PlanPriceInterval
  onUpgradePlan?: (priceId: string) => void
}): React.ReactElement {
  const [planFormated, setPlanFormated] = React.useState<{
    name: string
    quota: {
      rooms: string
      reservations: string
    }
    price: string
    priceId: string
  } | null>(null)

  React.useEffect(() => {
    setPlanFormated({
      name: parsePlanName(plan.name),
      quota: {
        rooms: parseQuota(plan.quota.rooms),
        reservations: parseQuota(plan.quota.reservations)
      },
      price: getPlanPricePerPeriod(plan, period),
      priceId: getPlanPriceIdPerPeriod(plan, period)
    })
  }, [plan, period])

  if (!planFormated) return <></>

  return (
    <Card
      onClick={() => onUpgradePlan && onUpgradePlan(planFormated?.priceId)}
      variant="outline"
      isHoverable
      cursor="pointer"
      mb="4"
      border="1px solid"
      borderColor="border!important"
      bg={isActive ? 'gray.50' : 'transparent'}
    >
      <CardBody p="6">
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">{planFormated?.name}</Text>
          <Text>
            <strong>{planFormated?.price}</strong> / {periodLabels[period]}
          </Text>
        </Flex>

        <Flex justifyContent="space-between">
          <HStack
            opacity="0.4"
            divider={
              <Text as="span" fontWeight="bold" color="whiteAlpha.400" mx="2">
                •
              </Text>
            }
          >
            <Text>{planFormated?.quota?.reservations} reservas</Text>
          </HStack>

          {planFormated?.price !== '$0.00' && !isActive && (
            <Text color="primary.500" fontWeight="bold">
              Pague por {periodLabels[period]}
            </Text>
          )}
        </Flex>
      </CardBody>
    </Card>
  )
}
