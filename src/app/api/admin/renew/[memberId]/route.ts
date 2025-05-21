import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { addMonths } from 'date-fns'

const prisma = new PrismaClient()

export async function POST(req: NextRequest, { params }: { params: { memberId: string } }) {
  const memberId = parseInt(params.memberId)
  const member = await prisma.member.findUnique({ where: { id: memberId } })

  if (!member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  }

  const { months } = await req.json()
  const duration = parseInt(months) || 1

  const previousEndDate = new Date(member.endDate)
  const today = new Date()
  const baseDate = previousEndDate > today ? previousEndDate : today

  const newEndDate = addMonths(baseDate, duration)

  await prisma.member.update({
    where: { id: memberId },
    data: { endDate: newEndDate },
  })

  await prisma.renewal.create({
    data: {
      memberId,
      previousEndDate,
      newEndDate,
    },
  })

  return NextResponse.json({ message: 'Renewed', newEndDate })
}

