import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

// Initialize Prisma correctly
const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Add validation
    if (!body.name || !body.email || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert dates and validate
    const startDate = new Date(body.startDate)
    const endDate = new Date(body.endDate)
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    const newMember = await prisma.member.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        startDate,
        endDate,
      },
    })

    return NextResponse.json(newMember, { status: 201 })
  } catch (err: any) {
    console.error('Registration Error:', err)
    
    // Handle Prisma errors
    if (err.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}