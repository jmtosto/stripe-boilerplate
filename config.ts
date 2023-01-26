export const stripeConfig = {
  key: process.env.STRIPE_KEY as string,
  secretKey: process.env.STRIPE_SECRET_KEY as string,
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY as string,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string
}
