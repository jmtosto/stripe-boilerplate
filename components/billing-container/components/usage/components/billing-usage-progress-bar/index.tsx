import { Box, BoxProps, Flex, HStack, Progress, Text } from '@chakra-ui/react'
import { UserQuota } from '../../../../../../../../types/user'
import { parseQuota } from '../../../../utils/parse-quota'

export function BillingUsageProgressBar({
  planName,
  quotas,
  ...rest
}: {
  planName: string
  quotas: UserQuota
} & BoxProps): React.ReactElement {
  if (!quotas) return <></>

  return (
    <Box {...rest}>
      <Flex justifyContent="space-between">
        <Text>{planName}</Text>
        <Text>
          {quotas.rooms.used} / <b>{parseQuota(quotas.rooms.total)}</b>
        </Text>
      </Flex>
      <Progress
        my="2"
        value={quotas.rooms.used}
        max={quotas.rooms.total}
        borderRadius="full"
        colorScheme="primary"
      />
      <HStack
        opacity="0.4"
        divider={
          <Text as="span" fontWeight="bold" color="whiteAlpha.200" mx="2">
            •
          </Text>
        }
      >
        <Text>
          {quotas.reservations.used} /{' '}
          <b>{parseQuota(quotas.reservations.total)}</b> Reservas
        </Text>
      </HStack>
    </Box>
  )
}
