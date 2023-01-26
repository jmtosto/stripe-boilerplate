import React from 'react'

import { useToast } from '@chakra-ui/react'
import { PlanFeed } from './components/plan-feed'
import { BillingUsage } from './components/usage'

export function BillingContainer(): React.ReactElement {
  const toast = useToast()

  React.useEffect(() => {
    const query = new URLSearchParams(window.location.search)

    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.')
      toast({
        title: 'Order placed!',
        description: 'You will receive an email confirmation.',
        status: 'success',
        duration: 9000,
        position: 'top-right'
      })
    }

    if (query.get('canceled')) {
      console.log(
        'Order canceled -- continue to shop around and checkout when you’re ready.'
      )

      toast({
        title: 'Order canceled!',
        description: 'Select a plan to continue.',
        status: 'error',
        duration: 9000,
        position: 'top-right'
      })
    }
  }, [])

  return (
    <>
      <BillingUsage />
      <PlanFeed />
    </>
  )
}
