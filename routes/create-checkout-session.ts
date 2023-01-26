import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { prisma } from 'prisma-config'
import { getUrl } from '../../../../src/utils/get-url'
import { createOrRetrieveStripeCustomerId } from '../lib/create-or-retrieve-stripe-customer-id'
import { stripe } from '../utils/stripe'

export async function stripeCreateCheckoutSession(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  if (req.method === 'POST') {
    const { price, quantity = 1, metadata = {} } = req.body

    const supabase = createServerSupabaseClient({
      req,
      res
    })

    const userSession = await supabase.auth.getSession()

    if (!userSession.data.session) {
      return res
        .status(401)
        .json({ error: { statusCode: 401, message: 'Unauthorized' } })
    }

    if (!price)
      return res
        .status(400)
        .json({ error: { statusCode: 400, message: 'Price is required' } })

    try {
      const customer = await createOrRetrieveStripeCustomerId(
        userSession.data.session.user.id
      )

      if (!customer.stripeCustomerId) throw Error('Could not get customer')

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        customer: customer.stripeCustomerId,
        line_items: [
          {
            price: price,
            quantity
          }
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        subscription_data: {
          trial_from_plan: true,
          metadata
        },
        success_url: getUrl('/dashboard/settings?tab=1&success=true'),
        cancel_url: getUrl('/dashboard/settings?tab=1&cancel=true')
      })

      if (!session.url) throw Error('Could not create session')

      await prisma.planPrice.findFirst({
        where: {
          externalId: price
        },
        include: {
          plan: true
        }
      })

      return res.status(200).json({ sessionId: session.id })
    } catch (err: any) {
      console.log(err)
      res.status(500).json({ error: { statusCode: 500, message: err.message } })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
