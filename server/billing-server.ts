import { prisma } from 'prisma-config'
import { procedure } from '../../../server/trpc'
import { getUserWithBilling } from '../lib/get-user-with-billing'

export const billingServer = {
  getPlans: procedure.query(async ({ ctx }) => {
    const user = await getUserWithBilling(ctx.user.id)

    let plans = await prisma.plan.findMany({
      where: {
        active: true
      },
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true,
        metadata: true,
        prices: {
          where: {
            active: true
          },
          select: {
            id: true,
            externalId: true,
            currency: true,
            interval: true,
            intervalCount: true,
            type: true,
            unitAmount: true
          }
        }
      }
    })

    plans = plans.filter(plan => plan.id !== user.plan.planId)

    plans = plans.map(plan => {
      const metadata: any = plan.metadata

      return {
        ...plan,
        quota: {
          rooms: metadata?.rooms as number,
          reservations: metadata?.reservations as number
        }
      }
    })

    return plans
  })
}
