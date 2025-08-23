import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const betSchema = z.object({
  sport: z.string().min(1).max(50),
  team: z.string().min(1).max(100),
  opponent: z.string().min(1).max(100),
  betType: z.enum(['MONEYLINE', 'SPREAD', 'OVER_UNDER', 'PROP']),
  odds: z.number().finite(),
  stake: z.number().positive().max(10000),
  date: z.string().datetime(),
  notes: z.string().max(500).optional(),
})

const updateBetSchema = z.object({
  result: z.enum(['WIN', 'LOSS', 'PUSH']).optional(),
  payout: z.number().positive().optional(),
})

// GET /api/bets - Get user's bets
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const sport = searchParams.get('sport')
    const result = searchParams.get('result')

    const where: any = { userId: session.user.id }
    
    if (sport) where.sport = sport
    if (result) where.result = result

    const [bets, total] = await Promise.all([
      prisma.bet.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.bet.count({ where })
    ])

    return NextResponse.json({
      bets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get bets error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/bets - Create new bet
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user's plan limits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { _count: { select: { bets: true } } }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Free plan limit check
    if (user.plan === 'FREE' && user._count.bets >= 15) {
      return NextResponse.json(
        { error: 'Free plan limit reached. Upgrade to Pro for unlimited bets.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const betData = betSchema.parse(body)

    const bet = await prisma.bet.create({
      data: {
        ...betData,
        userId: session.user.id,
        date: new Date(betData.date),
      }
    })

    return NextResponse.json(bet, { status: 201 })

  } catch (error) {
    console.error('Create bet error:', error)
    
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
