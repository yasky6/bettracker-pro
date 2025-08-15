import { Bet } from '@/types';

const STORAGE_KEY = 'betting-tracker-bets';

export const saveBets = (bets: Bet[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bets));
  }
};

export const loadBets = (): Bet[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

export const calculateStats = (bets: Bet[]) => {
  const settledBets = bets.filter(bet => bet.result);
  
  const totalBets = settledBets.length;
  const totalStaked = bets.reduce((sum, bet) => sum + bet.stake, 0);
  const totalReturns = settledBets.reduce((sum, bet) => 
    sum + (bet.result === 'win' ? (bet.payout || 0) : 0), 0
  );
  const netProfit = totalReturns - totalStaked;
  const roi = totalStaked > 0 ? (netProfit / totalStaked) * 100 : 0;
  const winRate = totalBets > 0 ? (settledBets.filter(bet => bet.result === 'win').length / totalBets) * 100 : 0;
  const avgOdds = totalBets > 0 ? settledBets.reduce((sum, bet) => sum + bet.odds, 0) / totalBets : 0;

  return {
    totalBets,
    totalStaked,
    totalReturns,
    netProfit,
    roi,
    winRate,
    avgOdds
  };
};