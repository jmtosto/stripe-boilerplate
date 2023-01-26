import { prisma } from 'prisma-config'
import { UserQuota } from '../../../types/user'

export async function getUserWithBilling(userId: string) {
  const firstDayOfTheMonth = new Date()
  firstDayOfTheMonth.setDate(1)
  firstDayOfTheMonth.setHours(0, 0, 0, 0)

  const lastDayOfTheMonth = new Date()
  lastDayOfTheMonth.setMonth(lastDayOfTheMonth.getMonth() + 1)
  lastDayOfTheMonth.setDate(0)
  lastDayOfTheMonth.setHours(23, 59, 59, 999)

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      address: true,
      rooms: {
        select: {
          id: true,
          reservations: {
            select: {
              id: true,
              status: true,
              totalAmount: true,
              createdAt: true,
              updatedAt: true,
              customer: {
                select: {
                  id: true
                }
              }
            }
          }
        }
      },
      subscriptions: {
        select: {
          currentPeriodStart: true,
          currentPeriodEnd: true,
          price: {
            select: {
              currency: true,
              unitAmount: true,
              interval: true,
              plan: {
                select: {
                  id: true,
                  name: true,
                  metadata: true
                }
              }
            }
          }
        },
        where: {
          status: 'active',
          currentPeriodStart: {
            gte: firstDayOfTheMonth
          }
        }
      }
    }
  })

  if (!user) throw new Error('User not found')

  const actualSubscription = user?.subscriptions[0]

  const freePlan = await prisma.plan.findFirst({
    where: {
      prices: {
        some: {
          unitAmount: 0
        }
      }
    },
    include: {
      prices: true
    }
  })

  if (!freePlan) throw new Error('Free plan not found')

  let planQuota = freePlan?.metadata as {
    reservations: number
    rooms: number
  }

  let activePlan = {
    planId: freePlan.id,
    planName: freePlan.name,
    planPeriod: freePlan.prices[0].interval,
    planPrice: freePlan.prices[0].unitAmount as number,
    planPriceCurrency: freePlan.prices[0].currency,
    subscriptionCurrentPeriodStart: firstDayOfTheMonth,
    subscriptionCurrentPeriodEnd: lastDayOfTheMonth,
    quota: planQuota
  }

  if (actualSubscription) {
    const periodStart =
      actualSubscription.currentPeriodStart ?? firstDayOfTheMonth
    periodStart.setHours(0, 0, 0, 0)

    const periodEnd = actualSubscription.currentPeriodEnd ?? lastDayOfTheMonth
    periodEnd.setHours(23, 59, 59, 999)

    planQuota = actualSubscription.price.plan.metadata as {
      reservations: number
      rooms: number
    }

    activePlan = {
      planId: actualSubscription.price.plan.id,
      planName: actualSubscription.price.plan.name,
      planPeriod: actualSubscription.price.interval,
      planPrice: actualSubscription.price.unitAmount as number,
      planPriceCurrency: actualSubscription.price.currency,
      subscriptionCurrentPeriodStart: periodStart,
      subscriptionCurrentPeriodEnd: periodEnd,
      quota: planQuota
    }
  }

  const quota: UserQuota = {
    reservations: {
      used: user.rooms.reduce((acc, room) => {
        const reservations = room.reservations.filter(
          reservation =>
            reservation.createdAt >=
              activePlan.subscriptionCurrentPeriodStart &&
            reservation.createdAt <= activePlan.subscriptionCurrentPeriodEnd
        )

        return acc + reservations.length
      }, 0),
      total: Number(activePlan.quota.reservations) || 0
    },
    rooms: {
      used: user.rooms.length,
      total: Number(activePlan.quota.rooms) || 0
    }
  }

  return {
    ...user,
    quota,
    plan: activePlan
  }
}
