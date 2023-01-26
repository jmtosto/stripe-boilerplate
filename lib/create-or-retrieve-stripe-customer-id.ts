import { prisma, User } from 'prisma-config'
import { stripe } from '../utils/stripe'

export async function createOrRetrieveStripeCustomerId(
  userId: string
): Promise<User> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })

  if (user?.stripeCustomerId) return user

  const customer = await stripe.customers.create({
    metadata: {
      userId
    },
    name: user?.name || '',
    email: user?.email || ''
  })

  return prisma.user.update({
    where: {
      id: userId
    },
    data: {
      stripeCustomerId: customer.id
    }
  })
}
