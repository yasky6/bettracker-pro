'use client';

import React, { useMemo } from 'react';
import { Bet } from '@/types';

interface AdvancedAnalyticsProps {
  bets: Bet[];
}

interface SportStats {
  sport: string;
  totalBets: number;
  wins: number;
  losses: number;
  pushes: number;
  winRate: number;
  totalStaked: number;
  totalPayout: number;
  netProfit: number;
  roi: number;
  averageOdds: number;
  bestStreak: number;
  currentStreak: number;
}

interface MonthlyStats {
  month: string;
  totalBets: number;
  netProfit: number;
  winRate: number;
  roi: number;
}

const AdvancedAnalytics = React.memo(({ bets }: AdvancedAnalyticsProps) => {
  const analytics = useMemo(() => {
    // Calculate sport-specific statistics
    const sportStats: Record<string, SportStats> = {};
    const monthlyStats: Record<string, MonthlyStats> = {};
    
    let currentStreak = 0;
    let bestWinStreak = 0;
    let bestLossStreak = 0;
    let tempWinStreak = 0;
    let tempLossStreak = 0;
    
    // Sort bets by date for streak calculation
    const sortedBets = [...bets].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sortedBets.forEach((bet, index) => {
      const sport = bet.sport;
      const monthKey = new Date(bet.date).toISOString().slice(0, 7); // YYYY-MM
      
      // Initialize sport stats
      if (!sportStats[sport]) {
        sportStats[sport] = {
          sport,
          totalBets: 0,
          wins: 0,
          losses: 0,
          pushes: 0,
          winRate: 0,
          totalStaked: 0,
          totalPayout: 0,
          netProfit: 0,
          roi: 0,
          averageOdds: 0,
          bestStreak: 0,
          currentStreak: 0
        };
      }
      
      // Initialize monthly stats
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          month: monthKey,
          totalBets: 0,
          netProfit: 0,
          winRate: 0,
          roi: 0
        };
      }
      
      // Update sport stats
      const sportStat = sportStats[sport];
      sportStat.totalBets++;
      sportStat.totalStaked += bet.stake;
      
      // Update monthly stats
      const monthlyStat = monthlyStats[monthKey];
      monthlyStat.totalBets++;
      
      if (bet.result) {
        if (bet.result === 'win') {
          sportStat.wins++;
          sportStat.totalPayout += bet.payout || 0;
          monthlyStat.netProfit += (bet.payout || 0) - bet.stake;
          
          // Streak calculation
          tempWinStreak++;
          tempLossStreak = 0;
          if (tempWinStreak > bestWinStreak) bestWinStreak = tempWinStreak;
          
        } else if (bet.result === 'loss') {
          sportStat.losses++;
          monthlyStat.netProfit -= bet.stake;
          
          // Streak calculation
          tempLossStreak++;
          tempWinStreak = 0;
          if (tempLossStreak > bestLossStreak) bestLossStreak = tempLossStreak;
          
        } else if (bet.result === 'push') {
          sportStat.pushes++;
          sportStat.totalPayout += bet.stake; // Return original stake
        }
      }
    });
    
    // Calculate derived statistics
    Object.values(sportStats).forEach(stat => {
      stat.winRate = stat.totalBets > 0 ? (stat.wins / (stat.wins + stat.losses)) * 100 : 0;
      stat.netProfit = stat.totalPayout - stat.totalStaked;
      stat.roi = stat.totalStaked > 0 ? (stat.netProfit / stat.totalStaked) * 100 : 0;
      stat.averageOdds = stat.totalBets > 0 ? 
        bets.filter(b => b.sport === stat.sport).reduce((sum, b) => sum + Math.abs(b.odds), 0) / stat.totalBets : 0;
    });
    
    Object.values(monthlyStats).forEach(stat => {
      const monthBets = bets.filter(b => b.date.startsWith(stat.month) && b.result);
      const wins = monthBets.filter(b => b.result === 'win').length;
      const losses = monthBets.filter(b => b.result === 'loss').length;
      stat.winRate = (wins + losses) > 0 ? (wins / (wins + losses)) * 100 : 0;
      
      const totalStaked = monthBets.reduce((sum, b) => sum + b.stake, 0);
      stat.roi = totalStaked > 0 ? (stat.netProfit / totalStaked) * 100 : 0;
    });
    
    return {
      sportStats: Object.values(sportStats).sort((a, b) => b.totalBets - a.totalBets),
      monthlyStats: Object.values(monthlyStats).sort((a, b) => a.month.localeCompare(b.month)),
      streaks: {
        bestWinStreak,
        bestLossStreak,
        currentStreak: tempWinStreak > 0 ? tempWinStreak : -tempLossStreak
      }
    };
  }, [bets]);

  const overallStats = useMemo(() => {
    const settledBets = bets.filter(bet => bet.result);
    const wins = settledBets.filter(bet => bet.result === 'win').length;
    const losses = settledBets.filter(bet => bet.result === 'loss').length;
    const totalStaked = bets.reduce((sum, bet) => sum + bet.stake, 0);
    const totalPayout = bets.reduce((sum, bet) => sum + (bet.payout || 0), 0);
    
    return {
      totalBets: bets.length,
      settledBets: settledBets.length,
      pendingBets: bets.length - settledBets.length,
      winRate: (wins + losses) > 0 ? (wins / (wins + losses)) * 100 : 0,
      totalStaked,
      totalPayout,
      netProfit: totalPayout - totalStaked,
      roi: totalStaked > 0 ? ((totalPayout - totalStaked) / totalStaked) * 100 : 0,
      averageStake: bets.length > 0 ? totalStaked / bets.length : 0,
      largestWin: Math.max(...bets.map(bet => (bet.payout || 0) - bet.stake), 0),
      largestLoss: Math.max(...bets.filter(bet => bet.result === 'loss').map(bet => bet.stake), 0)
    };
  }, [bets]);

  if (bets.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-white mb-3">No Data Yet</h3>
        <p className="text-gray-400 text-lg">
          Add some bets to see detailed analytics and insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overall Performance */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white">Advanced Analytics</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Bets</p>
            <p className="text-2xl font-bold text-white">{overallStats.totalBets}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Win Rate</p>
            <p className="text-2xl font-bold text-green-400">{overallStats.winRate.toFixed(1)}%</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">ROI</p>
            <p className={`text-2xl font-bold ${overallStats.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {overallStats.roi.toFixed(1)}%
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Net Profit</p>
            <p className={`text-2xl font-bold ${overallStats.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${overallStats.netProfit.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Avg Stake</p>
            <p className="text-2xl font-bold text-cyan-400">${overallStats.averageStake.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Best Streak</p>
            <p className="text-2xl font-bold text-yellow-400">{analytics.streaks.bestWinStreak}W</p>
          </div>
        </div>
      </div>

      {/* Sport Performance */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-6">Performance by Sport</h3>
        <div className="space-y-4">
          {analytics.sportStats.map((sport) => (
            <div key={sport.sport} className="bg-gray-800/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-white">{sport.sport}</h4>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-400">{sport.totalBets} bets</span>
                  <span className={`font-medium ${sport.winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                    {sport.winRate.toFixed(1)}% win rate
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Record</p>
                  <p className="text-sm font-medium text-white">
                    {sport.wins}W-{sport.losses}L{sport.pushes > 0 ? `-${sport.pushes}P` : ''}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Net Profit</p>
                  <p className={`text-sm font-medium ${sport.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${sport.netProfit.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">ROI</p>
                  <p className={`text-sm font-medium ${sport.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {sport.roi.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Odds</p>
                  <p className="text-sm font-medium text-cyan-400">
                    {sport.averageOdds > 0 ? '+' : ''}{sport.averageOdds.toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Total Staked</p>
                  <p className="text-sm font-medium text-white">${sport.totalStaked.toFixed(2)}</p>
                </div>
              </div>
              
              {/* Win Rate Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      sport.winRate >= 60 ? 'bg-green-500' : 
                      sport.winRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(sport.winRate, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-6">Monthly Performance</h3>
        <div className="space-y-3">
          {analytics.monthlyStats.slice(-6).map((month) => (
            <div key={month.month} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-white min-w-[80px]">
                  {new Date(month.month + '-01').toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short' 
                  })}
                </div>
                <div className="text-sm text-gray-400">{month.totalBets} bets</div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Win Rate</p>
                  <p className={`text-sm font-medium ${month.winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                    {month.winRate.toFixed(1)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Profit</p>
                  <p className={`text-sm font-medium ${month.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${month.netProfit.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">ROI</p>
                  <p className={`text-sm font-medium ${month.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {month.roi.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-6">AI Insights & Recommendations</h3>
        <div className="space-y-4">
          {overallStats.winRate > 55 && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-green-300 mb-1">Strong Performance</h4>
                  <p className="text-sm text-green-200">
                    Your {overallStats.winRate.toFixed(1)}% win rate is excellent! Consider increasing your stake sizes on your most profitable sports.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {analytics.sportStats.length > 1 && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-300 mb-1">Sport Diversification</h4>
                  <p className="text-sm text-blue-200">
                    You're betting on {analytics.sportStats.length} different sports. 
                    Focus more on {analytics.sportStats[0].sport} where you have the best ROI of {analytics.sportStats[0].roi.toFixed(1)}%.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {overallStats.roi < 0 && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-300 mb-1">Bankroll Management</h4>
                  <p className="text-sm text-yellow-200">
                    Consider reducing your stake sizes and focusing on value bets. Your current ROI is {overallStats.roi.toFixed(1)}%.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

AdvancedAnalytics.displayName = 'AdvancedAnalytics';

export default AdvancedAnalytics;
