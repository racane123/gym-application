import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { buffer } from 'micro'
import { prisma } from '@/lib/prisma'
import { addMonths } from 'date-fns'
import { sendRenewalConfirmation } from '@/lib/sendEmail'

export const config = { api: { bodyParser: false } }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const memberId = parseInt(session.metadata.memberId)
    const months = parseInt(session.metadata.months)

    const member = await prisma.member.findUnique({ where: { id: memberId } })

    if (member) {
      const today = new Date()
      const base = member.endDate > today ? new Date(member.endDate) : today
      const newEndDate = addMonths(base, months)

      await prisma.member.update({
        where: { id: memberId },
        data: { endDate: newEndDate },
      })
      
      await prisma.renewal.create({
        data: {
          memberId,
          previousEndDate: member.endDate,
          newEndDate,
        },
      })
      
      await sendRenewalConfirmation({
        to: member.email,
        name: member.name,
        months,
        newEndDate,
      })
    }
  }

  return NextResponse.json({ received: true })
}
