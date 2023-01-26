/* eslint-disable camelcase */
import Stripe from 'stripe'

import { PlanPriceInterval } from '@prisma/client'
import { prisma } from 'prisma-config'

export const upsertPriceRecord = async (price: Stripe.Price): Promise<void> => {
  if (!price.product) throw new Error('Price product not found!')

  const plan = await prisma.plan.findUnique({
    where: { externalId: price.product as string }
  })

  if (!plan) throw new Error('Plan not found!')

  const priceData = {
    externalId: price.id,
    planId: plan.id,
    active: price.active,
    currency: price.currency,
    description: price.nickname,
    type: price.type,
    unitAmount: price.unit_amount,
    interval: price.recurring?.interval as PlanPriceInterval,
    intervalCount: price.recurring?.interval_count ?? null,
    trialPeriodDays: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata as any
  }

  const planPrice = await prisma.planPrice.upsert({
    where: { externalId: price.id },
    update: priceData,
    create: priceData
  })
  if (planPrice) throw new Error('Plan price not found or created!')
  console.log(`Price inserted/updated: ${price.id}`)
}
