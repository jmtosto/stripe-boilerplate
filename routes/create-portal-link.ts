import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { getUrl } from '../../../../src/utils/get-url'
import { createOrRetrieveStripeCustomerId } from '../lib/create-or-retrieve-stripe-customer-id'
import { stripe } from '../utils/stripe'

export async function stripeCreatePortalLink(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  if (req.method === 'POST') {
    try {
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

      const customer = await createOrRetrieveStripeCustomerId(
        userSession.data.session.user.id
      )

      if (!customer.stripeCustomerId) throw Error('Could not get customer')

      const { url } = await stripe.billingPortal.sessions.create({
        customer: customer.stripeCustomerId,
        return_url: getUrl('/dashboard/settings?tab=1')
      })

      return res.status(200).json({ url })
    } catch (err: any) {
      console.log(err)
      res.status(500).json({ error: { statusCode: 500, message: err.message } })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
