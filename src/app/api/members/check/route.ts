import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const url = new URL(req.url)
  const email = url.searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const member = await prisma.member.findUnique({ where: { email } })

  if (!member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  }

  const isActive = new Date(member.endDate) >= new Date()

  return NextResponse.json({
    endDate: member.endDate,
    status: isActive ? 'active' : 'expired',
  })
}
