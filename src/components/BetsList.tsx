'use client';

import { Bet } from '@/types';
import { format } from 'date-fns';

interface BetsListProps {
  bets: Bet[];
  onUpdateBet: (id: string, result: 'win' | 'loss' | 'push', payout?: number) => void;
  onDeleteBet: (id: string) => void;
}

export default function BetsList({ bets, onUpdateBet, onDeleteBet }: BetsListProps) {
  const calculatePayout = (odds: number, stake: number) => {
    if (odds > 0) {
      return stake + (stake * odds / 100);
    } else {
      return stake + (stake * 100 / Math.abs(odds));
    }
  };

  const handleResultChange = (bet: Bet, result: 'win' | 'loss' | 'push') => {
    const payout = result === 'win' ? calculatePayout(bet.odds, bet.stake) : 0;
    onUpdateBet(bet.id, result, payout);
  };

  if (bets.length === 0) {
    return (
      <div className="card text-center py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">No bets yet</h3>
        <p className="text-gray-400 text-lg">Add your first bet to start tracking your performance!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-xl">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Betting History</h2>
          <p className="text-sm text-gray-400">Track and analyze your performance</p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-gray-700/50 shadow-2xl">
        <table className="min-w-full divide-y divide-gray-700/50">
          <thead className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm">
            <tr>
              <th className="px-6 py-5 text-left text-xs font-black text-gray-300 uppercase tracking-widest">
                Date
              </th>
              <th className="px-6 py-5 text-left text-xs font-black text-gray-300 uppercase tracking-widest">
                Match
              </th>
              <th className="px-6 py-5 text-left text-xs font-black text-gray-300 uppercase tracking-widest">
                Type
              </th>
              <th className="px-6 py-5 text-left text-xs font-black text-gray-300 uppercase tracking-widest">
                Odds
              </th>
              <th className="px-6 py-5 text-left text-xs font-black text-gray-300 uppercase tracking-widest">
                Stake
              </th>
              <th className="px-6 py-5 text-left text-xs font-black text-gray-300 uppercase tracking-widest">
                Result
              </th>
              <th className="px-6 py-5 text-left text-xs font-black text-gray-300 uppercase tracking-widest">
                P&L
              </th>
              <th className="px-6 py-5 text-left text-xs font-black text-gray-300 uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800/20 backdrop-blur-sm divide-y divide-gray-700/30">
            {bets.map((bet, index) => (
              <tr key={bet.id} className={`hover:bg-gray-700/30 transition-all duration-300 ${index % 2 === 0 ? 'bg-gray-800/10' : 'bg-gray-800/30'}`}>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-bold text-white">{format(new Date(bet.date), 'MMM dd')}</div>
                  <div className="text-xs text-gray-400">{format(new Date(bet.date), 'yyyy')}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-bold text-white truncate max-w-48">
                    {bet.team} vs {bet.opponent}
                  </div>
                  <div className="text-xs text-cyan-400 font-semibold">{bet.sport}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-300 truncate max-w-24">
                  {bet.betType.replace('_', ' ')}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-white">
                  {bet.odds > 0 ? '+' : ''}{bet.odds}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-white">
                  ${bet.stake.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  {bet.result ? (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      bet.result === 'win' ? 'bg-green-100 text-green-800' :
                      bet.result === 'loss' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {bet.result}
                    </span>
                  ) : (
                    <select
                      onChange={(e) => handleResultChange(bet, e.target.value as any)}
                      className="text-xs border border-gray-600 rounded-lg px-3 py-2 bg-gray-800/50 text-white focus:bg-gray-800 focus:border-cyan-500 transition-all duration-300"
                      defaultValue=""
                    >
                      <option value="">Pending</option>
                      <option value="win">Win</option>
                      <option value="loss">Loss</option>
                      <option value="push">Push</option>
                    </select>
                  )}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-bold">
                  {bet.result ? (
                    <span className={bet.result === 'win' ? 'text-emerald-400' : 
                                   bet.result === 'loss' ? 'text-red-400' : 'text-gray-400'}>
                      {bet.result === 'win' ? `+$${((bet.payout || 0) - bet.stake).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                       bet.result === 'loss' ? `-$${bet.stake.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'}
                    </span>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <button
                    onClick={() => onDeleteBet(bet.id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200"
                    title="Delete bet"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm">
            <tr className="font-black">
              <td className="px-6 py-6 text-sm text-white" colSpan={4}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-black">Σ</span>
                  </div>
                  <span className="text-xl font-black bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">TOTAL</span>
                </div>
              </td>
              <td className="px-6 py-6 text-lg font-black text-white">
                ${bets.reduce((sum, bet) => sum + bet.stake, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="px-6 py-6 text-lg font-black text-white">
                {bets.filter(bet => bet.result).length} / {bets.length}
              </td>
              <td className="px-6 py-6 text-xl font-black">
                <span className={bets.reduce((sum, bet) => {
                  if (bet.result === 'win') return sum + ((bet.payout || 0) - bet.stake);
                  if (bet.result === 'loss') return sum - bet.stake;
                  return sum;
                }, 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {bets.reduce((sum, bet) => {
                    if (bet.result === 'win') return sum + ((bet.payout || 0) - bet.stake);
                    if (bet.result === 'loss') return sum - bet.stake;
                    return sum;
                  }, 0) >= 0 ? '+' : ''}${bets.reduce((sum, bet) => {
                    if (bet.result === 'win') return sum + ((bet.payout || 0) - bet.stake);
                    if (bet.result === 'loss') return sum - bet.stake;
                    return sum;
                  }, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </td>
              <td className="px-6 py-6"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}