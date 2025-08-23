import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateBetSchema = z.object({
  result: z.enum(['WIN', 'LOSS', 'PUSH']).optional(),
  payout: z.number().positive().optional(),
})

// PUT /api/bets/[id] - Update bet
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const updateData = updateBetSchema.parse(body)

    // Verify bet belongs to user
    const existingBet = await prisma.bet.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingBet) {
      return NextResponse.json({ error: 'Bet not found' }, { status: 404 })
    }

    const updatedBet = await prisma.bet.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(updatedBet)

  } catch (error) {
    console.error('Update bet error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/bets/[id] - Delete bet
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify bet belongs to user
    const existingBet = await prisma.bet.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingBet) {
      return NextResponse.json({ error: 'Bet not found' }, { status: 404 })
    }

    await prisma.bet.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Bet deleted successfully' })

  } catch (error) {
    console.error('Delete bet error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
