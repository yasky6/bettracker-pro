'use client';

import { useSession } from 'next-auth/react';
import { Bet } from '@/types';
import { calculateStats } from '@/lib/database';
import { useBets, useCreateBet, useUpdateBet, useDeleteBet } from '@/hooks/useBets';
import { useBetStore } from '@/stores/betStore';
import BetForm from '@/components/BetForm';
import StatsCards from '@/components/StatsCards';
import BetsList from '@/components/BetsList';
import LiveGames from '@/components/LiveGames';
import ESPNScores from '@/components/ESPNScores';
import AdvancedCharts from '@/components/AdvancedCharts';
import AIInsights from '@/components/AIInsights';
import LiveAlerts from '@/components/LiveAlerts';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import { Game } from '@/lib/sportsApi';
import toast from 'react-hot-toast';

export default function Home() {
  const { status } = useSession();
  
  // Use React Query hooks for data management
  const { bets, isLoading, error, refetch } = useBets();
  const createBetMutation = useCreateBet();
  const updateBetMutation = useUpdateBet();
  const deleteBetMutation = useDeleteBet();
  
  // Access Zustand store for computed values
  const { stats: storeStats } = useBetStore();

  const addBet = async (betData: Omit<Bet, 'id'>) => {
    createBetMutation.mutate(betData);
  };

  const handleQuickBet = async (game: Game, team: string, odds: number) => {
    const opponent = team === game.home_team ? game.away_team : game.home_team;
    const betData: Omit<Bet, 'id'> = {
      sport: game.sport_title,
      team: team,
      opponent: opponent,
      betType: 'moneyline',
      odds: odds,
      stake: 25, // Default stake
      date: new Date().toISOString().split('T')[0],
      notes: `Quick bet from live games - ${game.bookmakers?.[0]?.title || 'Live odds'}`
    };
    await addBet(betData);
  };

  const updateBet = async (id: string, result: 'win' | 'loss' | 'push', payout?: number) => {
    updateBetMutation.mutate({ id, updates: { result, payout } });
  };

  const deleteBet = async (betId: string) => {
    toast((t) => (
      <div className="flex flex-col space-y-3">
        <p className="font-medium">Delete this bet?</p>
        <p className="text-sm text-gray-300">This action cannot be undone.</p>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              deleteBetMutation.mutate(betId);
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  // Show login prompt if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-4">Welcome to BetTracker Pro</h2>
          <p className="text-gray-400 mb-8">
            Sign in to start tracking your sports bets and analyzing your performance.
          </p>
          <div className="space-y-4">
            <a href="/login" className="btn-primary w-full text-center block">
              Sign In
            </a>
            <a href="/signup" className="btn-secondary w-full text-center block">
              Create Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your bets...</p>
        </div>
      </div>
    );
  }

  const stats = calculateStats(bets);
  const freePlanLimit = 15;
  const isAtLimit = bets.length >= freePlanLimit;

  return (
    <div className="space-y-8">
      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-300">{String(error)}</p>
            <button 
              onClick={() => refetch()}
              className="ml-auto bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Free Plan Warning */}
      {bets.length >= freePlanLimit - 2 && (
        <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6 shadow-2xl">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-black text-amber-300">
                {isAtLimit ? 'Free Plan Limit Reached' : 'Approaching Free Plan Limit'}
              </h3>
              <div className="mt-3 text-sm text-amber-100">
                <p>
                  {isAtLimit 
                    ? `You've reached the ${freePlanLimit} bet limit for free users. Upgrade to Pro for unlimited bets and advanced analytics.`
                    : `You have ${freePlanLimit - bets.length} bets remaining on the free plan.`
                  }
                </p>
              </div>
              <div className="mt-6">
                <a href="/upgrade" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-sm font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 inline-block">
                  Upgrade to Pro - $0.99/month
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <StatsCards stats={stats} />

      {/* Live Games */}
      <LiveGames onQuickBet={handleQuickBet} />

      {/* ESPN Scores */}
      <ESPNScores />

      {/* Advanced Analytics */}
      <AdvancedAnalytics bets={bets} />

      {/* Pro Features */}
      <AdvancedCharts bets={bets} />
      <AIInsights bets={bets} />
      <LiveAlerts />

      {/* Add Bet Form */}
      {!isAtLimit && <BetForm onAddBet={addBet} />}
      
      {isAtLimit && (
        <div className="card text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-white mb-3">Upgrade to Add More Bets</h3>
          <p className="text-gray-400 text-lg mb-8">
            You've reached the free plan limit. Upgrade to Pro for unlimited bets.
          </p>
          <a href="/upgrade" className="btn-primary text-xl py-4 px-8 inline-block text-center">
            Upgrade Now
          </a>
        </div>
      )}

      {/* Bets List */}
      <BetsList bets={bets} onUpdateBet={updateBet} onDeleteBet={deleteBet} />
    </div>
  );
}
