'use client';

import { BettingStats } from '@/types';

interface StatsCardsProps {
  stats: BettingStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      <div className="stat-card group">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/30 transition-all duration-300">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Bets</p>
        </div>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white group-hover:text-cyan-300 transition-colors duration-300 break-words">{stats.totalBets}</p>
        <p className="text-xs text-gray-500 mt-1">Lifetime</p>
      </div>

      <div className="stat-card group">
        <div className="flex items-center space-x-2 mb-2">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 ${
            stats.netProfit >= 0 
              ? 'bg-gradient-to-br from-emerald-500 to-green-600 group-hover:shadow-emerald-500/30' 
              : 'bg-gradient-to-br from-red-500 to-red-600 group-hover:shadow-red-500/30'
          }`}>
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Net Profit</p>
        </div>
        <p className={`text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black group-hover:scale-105 transition-all duration-300 break-words ${
          stats.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
        }`}>
          {formatCurrency(stats.netProfit)}
        </p>
        <p className="text-xs text-gray-500 mt-1">All time P&L</p>
      </div>

      <div className="stat-card group">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">ROI</p>
        </div>
        <p className={`text-2xl sm:text-3xl lg:text-4xl font-black group-hover:scale-105 transition-all duration-300 break-words ${
          stats.roi >= 0 ? 'text-emerald-400' : 'text-red-400'
        }`}>
          {formatPercentage(stats.roi)}
        </p>
        <p className="text-xs text-gray-500 mt-1">Return on investment</p>
      </div>

      <div className="stat-card group">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-amber-500/30 transition-all duration-300">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Win Rate</p>
        </div>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white group-hover:text-amber-300 transition-colors duration-300 break-words">
          {formatPercentage(stats.winRate)}
        </p>
        <p className="text-xs text-gray-500 mt-1">Success percentage</p>
      </div>
    </div>
  );
}