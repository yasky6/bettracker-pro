'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Bet } from '@/types';
import { useState } from 'react';
import { format } from 'date-fns';

interface AdvancedChartsProps {
  bets: Bet[];
}

export default function AdvancedCharts({ bets }: AdvancedChartsProps) {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<string>('all');
  const [profitTimePeriod, setProfitTimePeriod] = useState<string>('all');
  const [betTypeTimePeriod, setBetTypeTimePeriod] = useState<string>('all');
  const settledBets = bets.filter(bet => bet.result);
  
  // Filter bets for profit chart
  const getProfitFilteredBets = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return settledBets.filter(bet => {
      const betDate = new Date(bet.date);
      
      switch (profitTimePeriod) {
        case 'daily':
          return betDate >= today;
        case 'weekly':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return betDate >= weekAgo;
        case 'monthly':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return betDate >= monthAgo;
        case 'yearly':
          const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
          return betDate >= yearAgo;
        case 'yoy':
          const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          return betDate >= lastYear;
        default:
          return true;
      }
    });
  };

  // Profit/Loss over time
  const profitFilteredBets = getProfitFilteredBets();
  const profitData = profitFilteredBets.map((bet, index) => {
    const profit = bet.result === 'win' ? ((bet.payout || 0) - bet.stake) : -bet.stake;
    const runningTotal = profitFilteredBets.slice(0, index + 1).reduce((sum, b) => {
      return sum + (b.result === 'win' ? ((b.payout || 0) - b.stake) : -b.stake);
    }, 0);
    
    return {
      bet: index + 1,
      profit: runningTotal,
      date: bet.date
    };
  });

  // Filter bets by time period
  const getFilteredBets = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return settledBets.filter(bet => {
      const betDate = new Date(bet.date);
      
      switch (timePeriod) {
        case 'daily':
          return betDate >= today;
        case 'weekly':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return betDate >= weekAgo;
        case 'monthly':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return betDate >= monthAgo;
        case 'yearly':
          const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
          return betDate >= yearAgo;
        case 'yoy':
          const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          return betDate >= lastYear;
        default:
          return true;
      }
    });
  };

  // Win rate by sport (filtered by time period)
  const filteredBets = getFilteredBets();
  const sportData = filteredBets.length > 0 ? Object.entries(
    filteredBets.reduce((acc, bet) => {
      if (!acc[bet.sport]) acc[bet.sport] = { wins: 0, total: 0 };
      acc[bet.sport].total++;
      if (bet.result === 'win') acc[bet.sport].wins++;
      return acc;
    }, {} as Record<string, { wins: number; total: number }>)
  ).map(([sport, data]) => ({
    sport,
    winRate: Math.round((data.wins / data.total) * 100),
    wins: data.wins,
    losses: data.total - data.wins,
    count: `${data.wins}/${data.total}`
  })) : [];

  const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="card">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-xl">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Advanced Analytics</h2>
          <p className="text-sm text-gray-400">Pro-level insights and charts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profit/Loss Chart */}
        <div className="stat-card group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Profit/Loss Over Time</h3>
            <select
              value={profitTimePeriod}
              onChange={(e) => setProfitTimePeriod(e.target.value)}
              className="text-xs bg-gray-800/50 border border-gray-600 rounded-lg px-2 py-1 text-white focus:border-cyan-500 transition-colors"
            >
              <option value="all">All Time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="yoy">Year over Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={profitData} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="bet" stroke="#9ca3af" label={{ value: 'Number of Bets', position: 'insideBottom', offset: -20, style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: '12px' } }} />
              <YAxis stroke="#9ca3af" tickFormatter={(value) => value >= 1000 ? `$${(value/1000).toFixed(0)}k` : `$${value.toLocaleString()}`} width={80} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value) => [`$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Profit']}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#06b6d4" 
                strokeWidth={3}
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Win Rate by Sport */}
        <div className="stat-card group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Win Rate by Sport</h3>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="text-xs bg-gray-800/50 border border-gray-600 rounded-lg px-2 py-1 text-white focus:border-cyan-500 transition-colors"
            >
              <option value="all">All Time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="yoy">Year over Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sportData} onClick={(data) => data?.activeLabel && setSelectedSport(data.activeLabel)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="sport" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />

              <Bar 
                dataKey="winRate" 
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]}
                label={{ position: 'center', fill: '#fff', fontSize: 12, fontWeight: 'bold', formatter: (value: number) => `${value}%` }}
                style={{ cursor: 'pointer' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bet Distribution */}
        <div className="stat-card group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Bet Type Distribution</h3>
            <select
              value={betTypeTimePeriod}
              onChange={(e) => setBetTypeTimePeriod(e.target.value)}
              className="text-xs bg-gray-800/50 border border-gray-600 rounded-lg px-2 py-1 text-white focus:border-cyan-500 transition-colors"
            >
              <option value="all">All Time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="yoy">Year over Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={(() => {
                  const now = new Date();
                  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                  
                  const filteredBets = bets.filter(bet => {
                    const betDate = new Date(bet.date);
                    
                    switch (betTypeTimePeriod) {
                      case 'daily':
                        return betDate >= today;
                      case 'weekly':
                        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return betDate >= weekAgo;
                      case 'monthly':
                        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                        return betDate >= monthAgo;
                      case 'yearly':
                        const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
                        return betDate >= yearAgo;
                      case 'yoy':
                        const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                        return betDate >= lastYear;
                      default:
                        return true;
                    }
                  });
                  
                  return Object.entries(
                    filteredBets.reduce((acc, bet) => {
                      acc[bet.betType] = (acc[bet.betType] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([type, count]) => ({ name: type, value: count }));
                })()}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {sportData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Performance */}
        <div className="stat-card group">
          <h3 className="text-lg font-bold text-white mb-4">Monthly Performance</h3>
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">This Month (Dec)</span>
                <span className="text-emerald-400 font-bold">+$247.50</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>12 bets</span>
                <span>$450.00 staked</span>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Last Month (Nov)</span>
                <span className="text-red-400 font-bold">-$89.25</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>8 bets</span>
                <span>$320.00 staked</span>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Best Month (Oct)</span>
                <span className="text-emerald-400 font-bold">+$412.75</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>15 bets</span>
                <span>$600.00 staked</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sport Details Modal */}
      {selectedSport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelectedSport(null)}>
          <div className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/50 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">{selectedSport} Bets</h2>
              <button 
                onClick={() => setSelectedSport(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {bets.filter(bet => bet.sport === selectedSport).map((bet) => (
                <div key={bet.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold truncate">{bet.team} vs {bet.opponent}</p>
                      <p className="text-gray-400 text-sm truncate">{format(new Date(bet.date), 'MMM dd, yyyy')} • {bet.betType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{bet.odds > 0 ? '+' : ''}{bet.odds} • ${bet.stake}</p>
                      {bet.result && (
                        <p className={`text-sm font-semibold ${
                          bet.result === 'win' ? 'text-emerald-400' : 
                          bet.result === 'loss' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {bet.result === 'win' ? `+$${((bet.payout || 0) - bet.stake).toFixed(2)}` :
                           bet.result === 'loss' ? `-$${bet.stake.toFixed(2)}` : '$0.00'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}