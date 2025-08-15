'use client';

import { useState, useEffect } from 'react';
import { Bet } from '@/types';
import { saveBets, loadBets, calculateStats } from '@/lib/storage';
import BetForm from '@/components/BetForm';
import StatsCards from '@/components/StatsCards';
import BetsList from '@/components/BetsList';
import LiveGames from '@/components/LiveGames';
import ESPNScores from '@/components/ESPNScores';
import AdvancedCharts from '@/components/AdvancedCharts';
import AIInsights from '@/components/AIInsights';
import LiveAlerts from '@/components/LiveAlerts';
import { Game } from '@/lib/sportsApi';

export default function Home() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadedBets = loadBets();
    setBets(loadedBets);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveBets(bets);
    }
  }, [bets, isLoaded]);

  const addBet = (betData: Omit<Bet, 'id'>) => {
    if (bets.length >= freePlanLimit) {
      if (confirm('Free plan limit reached! You need to subscribe to Pro for unlimited bets. Go to upgrade page?')) {
        window.location.href = '/upgrade';
      }
      return;
    }
    
    const newBet: Bet = {
      ...betData,
      id: Date.now().toString()
    };
    setBets(prev => [newBet, ...prev]);
  };

  const handleQuickBet = (game: Game, team: string, odds: number) => {
    if (bets.length >= freePlanLimit) {
      if (confirm('Free plan limit reached! You need to subscribe to Pro for unlimited bets. Go to upgrade page?')) {
        window.location.href = '/upgrade';
      }
      return;
    }
    
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
    addBet(betData);
  };

  const updateBet = (id: string, result: 'win' | 'loss' | 'push', payout?: number) => {
    setBets(prev => prev.map(bet => 
      bet.id === id ? { ...bet, result, payout } : bet
    ));
  };

  const deleteBet = (betId: string) => {
    if (confirm('Are you sure you want to delete this bet?')) {
      setBets(prev => prev.filter(bet => bet.id !== betId));
    }
  };

  const stats = calculateStats(bets);
  const freePlanLimit = 15;
  const isAtLimit = bets.length >= freePlanLimit;

  return (
    <div className="space-y-8">
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