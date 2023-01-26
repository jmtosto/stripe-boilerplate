import { Badge, Button, ButtonGroup, Flex, Heading } from '@chakra-ui/react'
import { PlanPriceInterval } from '@prisma/client'

export function PlanFeedHeader({
  period,
  onPeriodChange
}: {
  period: PlanPriceInterval
  onPeriodChange: (period: PlanPriceInterval) => void
}): React.ReactElement {
  return (
    <Flex alignItems="center" justifyContent="space-between" mb="4">
      <Heading fontSize="lg">Planos</Heading>

      <ButtonGroup
        variant="ghost"
        size="xs"
        borderRadius="md"
        border="1px solid"
        p="2"
        _dark={{
          borderColor: 'whiteAlpha.200'
        }}
        _light={{
          borderColor: 'blackAlpha.200'
        }}
      >
        <Button
          isActive={period === 'month'}
          onClick={() => onPeriodChange('month')}
        >
          Mensal
        </Button>
        <Button
          isActive={period === 'year'}
          onClick={() => onPeriodChange('year')}
        >
          Anual
          <Badge ml="2" colorScheme="purple">
            2 meses grátis
          </Badge>
        </Button>
      </ButtonGroup>
    </Flex>
  )
}
