import axios from 'axios'

import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import { PlanFeedCard } from '../plan-feed/components/plan-feed-card'
import { BillingUsageProgressBar } from './components/billing-usage-progress-bar'
import { FiExternalLink } from 'react-icons/fi'
import { useAccount } from '../../../../../../hooks/use-account'
import { formatDate } from '../../../../../../utils/format-date'

export function BillingUsage(): React.ReactElement {
  const account = useAccount()

  const handleCreateCheckoutSession = async () => {
    try {
      const {
        data: { url }
      } = await axios.post('/api/subscriptions/create-portal-link')
      window.location.assign(url)
    } catch (error) {
      if (error) return alert((error as Error).message)
    }
  }

  if (!account.user.data) return <></>

  return (
    <Box as="section" mb="8">
      <Box as="header">
        <Text fontSize="md" fontWeight="semibold">
          Métricas de Uso
        </Text>
        <Text opacity="0.6" mb="8">
          Periodo de faturamento encerra em{' '}
          {formatDate(account.user.data.plan.subscriptionCurrentPeriodEnd)}
        </Text>
      </Box>
      <Box>
        <BillingUsageProgressBar
          planName={account.user.data.plan.planName}
          quotas={account.user.data.quota}
          mb="8"
        />

        <Flex alignItems="center" justifyContent="space-between" mb="4">
          <Heading fontSize="lg">Plano atual</Heading>

          {account.user.data.stripeCustomerId && (
            <Button
              onClick={handleCreateCheckoutSession}
              leftIcon={<FiExternalLink />}
              variant="link"
            >
              Alterar Plano
            </Button>
          )}
        </Flex>

        <PlanFeedCard
          isActive
          period="month"
          plan={{
            id: account.user.data.plan.planId,
            name: account.user.data.plan.planName,
            quota: {
              reservations: account.user.data.quota.reservations.total,
              rooms: account.user.data.quota.rooms.total
            },
            prices: [
              {
                type: 'recurring',
                interval: account.user.data.plan.planPeriod,
                currency: account.user.data.plan.planPriceCurrency,
                unitAmount: account.user.data.plan.planPrice
              }
            ]
          }}
        />
      </Box>
    </Box>
  )
}
