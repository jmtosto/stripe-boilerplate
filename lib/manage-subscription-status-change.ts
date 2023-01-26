import { prisma } from 'prisma-config'
import { stripe } from '../utils/stripe'
import { toStripeDateTime } from '../utils/to-stripe-date-time'

export async function manageSubscriptionStatusChange(
  subscriptionId: string,
  customerId: string
): Promise<void> {
  const account = await prisma.user.findUnique({
    where: {
      stripeCustomerId: customerId
    }
  })

  if (!account) throw Error('Account not found')

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method']
  })

  const price = await prisma.planPrice.findFirst({
    where: {
      externalId: subscription.items.data[0].price.id
    },
    include: {
      plan: true
    }
  })

  if (!price) throw Error('Plan not found')

  const payload = {
    externalId: subscription.id,
    userId: account?.id,
    priceId: price.id,
    metadata: subscription.metadata,
    status: subscription.status,
    quantity: 1,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    cancelAt: subscription.cancel_at
      ? toStripeDateTime(subscription.cancel_at).toISOString()
      : null,
    canceledAt: subscription.canceled_at
      ? toStripeDateTime(subscription.canceled_at).toISOString()
      : null,
    currentPeriodStart: toStripeDateTime(
      subscription.current_period_start
    ).toISOString(),
    currentPeriodEnd: toStripeDateTime(
      subscription.current_period_end
    ).toISOString(),
    createdAt: toStripeDateTime(subscription.created).toISOString(),
    endedAt: subscription.ended_at
      ? toStripeDateTime(subscription.ended_at).toISOString()
      : null,
    trialStart: subscription.trial_start
      ? toStripeDateTime(subscription.trial_start).toISOString()
      : null,
    trialEnd: subscription.trial_end
      ? toStripeDateTime(subscription.trial_end).toISOString()
      : null
  }

  await prisma.subscription.upsert({
    where: {
      externalId: subscription.id
    },
    create: payload,
    update: payload
  })
  console.log(`Subscription inserted/updated: ${subscription.id}`)
}
