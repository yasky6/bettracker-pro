import { prisma } from './prisma'
import { Bet, BettingStats } from '@/types'

export interface DatabaseBet {
  id: string
  sport: string
  team: string
  opponent: string
  betType: 'MONEYLINE' | 'SPREAD' | 'OVER_UNDER' | 'PROP'
  odds: number
  stake: number
  result?: 'WIN' | 'LOSS' | 'PUSH' | null
  payout?: number | null
  date: Date
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

// Convert database bet to frontend bet format
export const convertDatabaseBet = (dbBet: DatabaseBet): Bet => ({
  id: dbBet.id,
  sport: dbBet.sport,
  team: dbBet.team,
  opponent: dbBet.opponent,
  betType: dbBet.betType.toLowerCase() as 'moneyline' | 'spread' | 'over_under' | 'prop',
  odds: dbBet.odds,
  stake: dbBet.stake,
  result: dbBet.result?.toLowerCase() as 'win' | 'loss' | 'push' | undefined,
  payout: dbBet.payout || undefined,
  date: dbBet.date.toISOString().split('T')[0],
  notes: dbBet.notes || undefined,
})

// Convert frontend bet to database format
export const convertToDatabaseBet = (bet: Omit<Bet, 'id'>): Omit<DatabaseBet, 'id' | 'createdAt' | 'updatedAt'> => ({
  sport: bet.sport,
  team: bet.team,
  opponent: bet.opponent,
  betType: bet.betType.toUpperCase() as 'MONEYLINE' | 'SPREAD' | 'OVER_UNDER' | 'PROP',
  odds: bet.odds,
  stake: bet.stake,
  result: bet.result?.toUpperCase() as 'WIN' | 'LOSS' | 'PUSH' | undefined,
  payout: bet.payout,
  date: new Date(bet.date),
  notes: bet.notes,
})

// Client-side API functions
export const betApi = {
  // Get all bets for the current user
  async getBets(): Promise<Bet[]> {
    const response = await fetch('/api/bets')
    if (!response.ok) {
      throw new Error('Failed to fetch bets')
    }
    const data = await response.json()
    return data.bets.map(convertDatabaseBet)
  },

  // Create a new bet
  async createBet(bet: Omit<Bet, 'id'>): Promise<Bet> {
    const dbBet = convertToDatabaseBet(bet)
    const response = await fetch('/api/bets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...dbBet,
        date: dbBet.date.toISOString(),
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create bet')
    }

    const data = await response.json()
    return convertDatabaseBet(data)
  },

  // Update a bet
  async updateBet(id: string, updates: { result?: 'win' | 'loss' | 'push'; payout?: number }): Promise<Bet> {
    const response = await fetch(`/api/bets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        result: updates.result?.toUpperCase(),
        payout: updates.payout,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to update bet')
    }

    const data = await response.json()
    return convertDatabaseBet(data)
  },

  // Delete a bet
  async deleteBet(id: string): Promise<void> {
    const response = await fetch(`/api/bets/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete bet')
    }
  },
}

// Calculate stats from bets (client-side)
export const calculateStats = (bets: Bet[]): BettingStats => {
  // Input validation
  if (!Array.isArray(bets)) {
    return {
      totalBets: 0,
      totalStaked: 0,
      totalReturns: 0,
      netProfit: 0,
      roi: 0,
      winRate: 0,
      avgOdds: 0
    }
  }
  
  const validBets = bets.filter(bet => 
    bet && 
    typeof bet.stake === 'number' && 
    isFinite(bet.stake) &&
    typeof bet.odds === 'number' && 
    isFinite(bet.odds)
  )
  
  const settledBets = validBets.filter(bet => bet.result)
  
  const totalBets = settledBets.length
  const totalStaked = validBets.reduce((sum, bet) => sum + (bet.stake || 0), 0)
  const totalReturns = settledBets.reduce((sum, bet) => 
    sum + (bet.result === 'win' ? (bet.payout || 0) : 0), 0
  )
  const netProfit = totalReturns - totalStaked
  const roi = totalStaked > 0 ? (netProfit / totalStaked) * 100 : 0
  const winRate = totalBets > 0 ? (settledBets.filter(bet => bet.result === 'win').length / totalBets) * 100 : 0
  const avgOdds = totalBets > 0 ? settledBets.reduce((sum, bet) => sum + (bet.odds || 0), 0) / totalBets : 0

  return {
    totalBets,
    totalStaked: Math.round(totalStaked * 100) / 100,
    totalReturns: Math.round(totalReturns * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    roi: Math.round(roi * 100) / 100,
    winRate: Math.round(winRate * 100) / 100,
    avgOdds: Math.round(avgOdds * 100) / 100
  }
}
