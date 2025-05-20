import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const renewals = await prisma.renewal.findMany({
    include: { member: true },
    orderBy: { renewedAt: 'desc' },
  })

  return NextResponse.json(renewals)
}
