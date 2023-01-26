import { prisma } from 'prisma-config'
import Stripe from 'stripe'
import { stripeConfig } from '../config'

export async function upsertProductRecord(
  product: Stripe.Product
): Promise<void> {
  if (product.metadata.saas !== stripeConfig.key) return

  const productData = {
    externalId: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? '',
    image: product.images?.[0] ?? null,
    metadata: product.metadata as any,
    createdAt: new Date(product.created * 1000),
    updatedAt: new Date(product.updated * 1000)
  }

  const plan = await prisma.plan.upsert({
    where: { externalId: product.id },
    update: productData,
    create: productData
  })

  if (!plan) throw new Error('Plan not found or created!')
  console.log(`Product inserted/updated: ${product.id}`)
}
