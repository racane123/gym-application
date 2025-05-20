import { Resend } from 'resend'
import { addDays } from 'date-fns'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Create a singleton instance of Resend
const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    const today = new Date()
    const targetDate = addDays(today, 3) // Notify 3 days before expiry

    const members = await prisma.member.findMany({
      where: {
        endDate: {
          gte: today,
          lte: targetDate,
        },
      },
    })

    const results = []

    for (const member of members) {
      try {
        const alreadySent = await prisma.emailLog.findFirst({
          where: {
            memberId: member.id,
            type: 'renewal-reminder',
          },
        })
      
        if (alreadySent) {
          results.push({ email: member.email, status: 'skipped (already sent)' })
          continue
        }
      
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: member.email,
          subject: 'Your Gym Membership is Expiring Soon',
          html: `
            <p>Hi ${member.name},</p>
            <p>Your gym membership expires on <strong>${new Date(member.endDate).toLocaleDateString()}</strong>.</p>
            <p>Please <a href="${process.env.NEXT_PUBLIC_APP_URL}/members/renew">renew here</a> to stay active.</p>
            <p>Thanks!<br/>Your Gym Team</p>
          `,
        })
    
        await prisma.emailLog.create({
          data: {
            memberId: member.id,
            email: member.email,
            type: 'renewal-reminder',
          },
        })
    
        results.push({ email: member.email, status: 'sent and logged' })
      } catch (err) {
        console.error(`Failed to process member ${member.email}:`, err)
        results.push({ 
          email: member.email, 
          status: 'failed', 
          error: err instanceof Error ? err.message : 'Unknown error' 
        })
      }
    }
    
    return NextResponse.json({ 
      message: 'Process completed', 
      results,
      totalProcessed: members.length,
      successful: results.filter(r => r.status === 'sent and logged').length,
      skipped: results.filter(r => r.status === 'skipped (already sent)').length,
      failed: results.filter(r => r.status === 'failed').length
    })
  } catch (error) {
    console.error('Cron job failed:', error)
    return NextResponse.json({ 
      message: 'Process failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
