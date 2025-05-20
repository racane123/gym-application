import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const members = await prisma.member.findMany({
    orderBy: { endDate: 'asc' },
  })

  return NextResponse.json(members)
}
