import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { addMonths } from 'date-fns'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { email, months } = await req.json()

  try {
    const member = await prisma.member.findUnique({ where: { email } })

    if (!member) {
      return NextResponse.json({ message: 'Member not found' }, { status: 404 })
    }

    const now = new Date()
    const baseDate = member.endDate > now ? member.endDate : now
    const newEndDate = addMonths(baseDate, months)

    const updated = await prisma.member.update({
      where: { email },
      data: { endDate: newEndDate },
    })

    await prisma.renewal.create({
      data: {
        memberId: member.id,
        months,
        newEndDate,
      },
    })

    return NextResponse.json({ message: 'Membership renewed successfully!' }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Renewal failed' }, { status: 500 })
  }
}
