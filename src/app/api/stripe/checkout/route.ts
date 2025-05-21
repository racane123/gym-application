import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { memberId, months } = await req.json()

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'php',
        product_data: {
          name: `Gym Membership Renewal - ${months} Month(s)`,
        },
        unit_amount: months * 2000, // $20/month
      },
      quantity: 1,
    }],
    metadata: {
      memberId,
      months,
    },
    success_url: `https://your-domain.com/renew-success`,
    cancel_url: `https://your-domain.com/renew-cancel`,
  })

  return NextResponse.json({ url: session.url })
}
