import { Alert, AlertIcon, Button, Flex, Text } from '@chakra-ui/react'
import { useRoute } from '../../../../utils/use-route'

export function BillingEndQuotaAlert(): React.ReactElement {
  return (
    <Alert colorScheme="primary" position="sticky" top="0" zIndex="sticky">
      <AlertIcon />
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        <Text>
          Você atingiu o limite de anúncios disponíveis para sua conta. Para
          criar mais, você precisa atualizar seu plano.
        </Text>
        <Button onClick={useRoute('/dashboard/settings?tab=1')}>
          Atualizar
        </Button>
      </Flex>
    </Alert>
  )
}
