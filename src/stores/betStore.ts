import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Bet, BettingStats } from '@/types';
import { calculateStats } from '@/lib/database';

interface BetStore {
  // State
  bets: Bet[];
  stats: BettingStats;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setBets: (bets: Bet[]) => void;
  addBet: (bet: Bet) => void;
  updateBet: (id: string, updates: Partial<Bet>) => void;
  removeBet: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Computed
  getFreePlanUsage: () => { used: number; limit: number; isAtLimit: boolean };
  getBetsByStatus: (status?: 'win' | 'loss' | 'push') => Bet[];
  getBetsBySport: (sport: string) => Bet[];
}

export const useBetStore = create<BetStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        bets: [],
        stats: {
          totalBets: 0,
          totalStaked: 0,
          totalReturns: 0,
          netProfit: 0,
          roi: 0,
          winRate: 0,
          avgOdds: 0,
        },
        isLoading: false,
        error: null,

        // Actions
        setBets: (bets) => {
          const stats = calculateStats(bets);
          set({ bets, stats }, false, 'setBets');
        },

        addBet: (bet) => {
          const { bets } = get();
          const newBets = [bet, ...bets];
          const stats = calculateStats(newBets);
          set({ bets: newBets, stats }, false, 'addBet');
        },

        updateBet: (id, updates) => {
          const { bets } = get();
          const newBets = bets.map(bet => 
            bet.id === id ? { ...bet, ...updates } : bet
          );
          const stats = calculateStats(newBets);
          set({ bets: newBets, stats }, false, 'updateBet');
        },

        removeBet: (id) => {
          const { bets } = get();
          const newBets = bets.filter(bet => bet.id !== id);
          const stats = calculateStats(newBets);
          set({ bets: newBets, stats }, false, 'removeBet');
        },

        setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),
        
        setError: (error) => set({ error }, false, 'setError'),
        
        clearError: () => set({ error: null }, false, 'clearError'),

        // Computed getters
        getFreePlanUsage: () => {
          const { bets } = get();
          const limit = 15;
          const used = bets.length;
          return {
            used,
            limit,
            isAtLimit: used >= limit,
          };
        },

        getBetsByStatus: (status) => {
          const { bets } = get();
          if (!status) return bets.filter(bet => bet.result);
          return bets.filter(bet => bet.result === status);
        },

        getBetsBySport: (sport) => {
          const { bets } = get();
          return bets.filter(bet => bet.sport === sport);
        },
      }),
      {
        name: 'bet-store',
        // Only persist non-sensitive data
        partialize: (state) => ({
          bets: state.bets,
          stats: state.stats,
        }),
      }
    ),
    {
      name: 'bet-store',
    }
  )
);

// Selectors for better performance
export const selectBets = (state: BetStore) => state.bets;
export const selectStats = (state: BetStore) => state.stats;
export const selectIsLoading = (state: BetStore) => state.isLoading;
export const selectError = (state: BetStore) => state.error;
export const selectFreePlanUsage = (state: BetStore) => state.getFreePlanUsage();
