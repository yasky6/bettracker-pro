export interface Bet {
  id: string;
  sport: string;
  team: string;
  opponent: string;
  betType: 'moneyline' | 'spread' | 'over_under' | 'prop';
  odds: number;
  stake: number;
  result?: 'win' | 'loss' | 'push';
  payout?: number;
  date: string;
  notes?: string;
}

export interface BettingStats {
  totalBets: number;
  totalStaked: number;
  totalReturns: number;
  netProfit: number;
  roi: number;
  winRate: number;
  avgOdds: number;
}