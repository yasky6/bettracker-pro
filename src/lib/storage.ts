import { Bet } from '@/types';

const STORAGE_KEY = 'betting-tracker-bets';

export const saveBets = (bets: Bet[]): void => {
  if (typeof window !== 'undefined') {
    try {
      // Validate input
      if (!Array.isArray(bets)) {
        throw new Error('Invalid bets data');
      }
      
      // Sanitize data before storage
      const sanitizedBets = bets.map(bet => ({
        ...bet,
        team: typeof bet.team === 'string' ? bet.team.slice(0, 100) : '',
        market: typeof bet.market === 'string' ? bet.market.slice(0, 50) : '',
        odds: typeof bet.odds === 'number' && isFinite(bet.odds) ? bet.odds : 0,
        stake: typeof bet.stake === 'number' && isFinite(bet.stake) ? bet.stake : 0
      }));
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedBets));
    } catch (error) {
      console.error('Error saving bets:', error);
    }
  }
};

export const loadBets = (): Bet[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      
      // Validate loaded data
      if (!Array.isArray(parsed)) {
        console.warn('Invalid bets data in storage');
        return [];
      }
      
      return parsed.filter(bet => 
        bet && 
        typeof bet === 'object' &&
        typeof bet.id === 'string' &&
        typeof bet.team === 'string' &&
        typeof bet.odds === 'number' &&
        typeof bet.stake === 'number'
      );
    } catch (error) {
      console.error('Error loading bets:', error);
      return [];
    }
  }
  return [];
};

export const calculateStats = (bets: Bet[]) => {
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
    };
  }
  
  const validBets = bets.filter(bet => 
    bet && 
    typeof bet.stake === 'number' && 
    isFinite(bet.stake) &&
    typeof bet.odds === 'number' && 
    isFinite(bet.odds)
  );
  
  const settledBets = validBets.filter(bet => bet.result);
  
  const totalBets = settledBets.length;
  const totalStaked = validBets.reduce((sum, bet) => sum + (bet.stake || 0), 0);
  const totalReturns = settledBets.reduce((sum, bet) => 
    sum + (bet.result === 'win' ? (bet.payout || 0) : 0), 0
  );
  const netProfit = totalReturns - totalStaked;
  const roi = totalStaked > 0 ? (netProfit / totalStaked) * 100 : 0;
  const winRate = totalBets > 0 ? (settledBets.filter(bet => bet.result === 'win').length / totalBets) * 100 : 0;
  const avgOdds = totalBets > 0 ? settledBets.reduce((sum, bet) => sum + (bet.odds || 0), 0) / totalBets : 0;

  return {
    totalBets,
    totalStaked: Math.round(totalStaked * 100) / 100,
    totalReturns: Math.round(totalReturns * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    roi: Math.round(roi * 100) / 100,
    winRate: Math.round(winRate * 100) / 100,
    avgOdds: Math.round(avgOdds * 100) / 100
  };
};