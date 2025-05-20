import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { addDays } from 'date-fns'

const prisma = new PrismaClient()

export async function GET() {
  const today = new Date()
  const nextWeek = addDays(today, 7)

  const expiringSoon = await prisma.member.findMany({
    where: {
      endDate: {
        gte: today,
        lte: nextWeek,
      },
    },
    orderBy: { endDate: 'asc' },
  })

  return NextResponse.json(expiringSoon)
}
