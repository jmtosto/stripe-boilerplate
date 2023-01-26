import {
  Box,
  BoxProps,
  Button,
  Flex,
  HStack,
  Progress,
  Text
} from '@chakra-ui/react'
import { useAccount } from '../../../../hooks/use-account'
import { getPercentage } from '../../../../utils/get-percentage'
import { useRoute } from '../../../../utils/use-route'

export function BillingSidebarQuota(props: BoxProps): React.ReactElement {
  const { user } = useAccount()

  if (!user.data) return <></>

  const { total, used } = user.data.quota.rooms

  const percentage = getPercentage(total, used)

  return (
    <Box px="8" {...props}>
      <Flex alignItems="center" justifyContent="space-between" mb="3">
        <HStack>
          <Text>{user.data.plan?.planName.replace('VC.Resolve -', '')}</Text>
          <Text color="gray.500">{percentage}% usado</Text>
        </HStack>
        <Button
          size="sm"
          variant="link"
          color="primary.500"
          onClick={useRoute('/dashboard/settings?tab=1')}
        >
          Upgrade
        </Button>
      </Flex>
      <Progress
        size="sm"
        value={percentage}
        colorScheme="primary"
        borderRadius="full"
      />
    </Box>
  )
}
