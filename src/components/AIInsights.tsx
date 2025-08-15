'use client';

import { Bet } from '@/types';

interface AIInsightsProps {
  bets: Bet[];
}

export default function AIInsights({ bets }: AIInsightsProps) {
  const settledBets = bets.filter(bet => bet.result);
  
  const generateInsights = () => {
    const insights = [];
    
    // Win rate analysis
    const winRate = settledBets.length > 0 ? (settledBets.filter(bet => bet.result === 'win').length / settledBets.length) * 100 : 0;
    
    if (winRate > 60) {
      insights.push({
        type: 'success',
        title: 'Strong Performance',
        message: `Your ${winRate.toFixed(1)}% win rate is excellent. Consider increasing your stake sizes on similar bet types.`,
        icon: '🎯'
      });
    } else if (winRate < 45) {
      insights.push({
        type: 'warning',
        title: 'Performance Alert',
        message: `Your ${winRate.toFixed(1)}% win rate suggests reviewing your betting strategy. Focus on higher probability bets.`,
        icon: '⚠️'
      });
    }

    // Bet type analysis
    const betTypes = settledBets.reduce((acc, bet) => {
      if (!acc[bet.betType]) acc[bet.betType] = { wins: 0, total: 0, profit: 0 };
      acc[bet.betType].total++;
      if (bet.result === 'win') {
        acc[bet.betType].wins++;
        acc[bet.betType].profit += (bet.payout || 0) - bet.stake;
      } else {
        acc[bet.betType].profit -= bet.stake;
      }
      return acc;
    }, {} as Record<string, { wins: number; total: number; profit: number }>);

    const bestBetType = Object.entries(betTypes).reduce((best, [type, data]) => {
      const winRate = data.wins / data.total;
      return winRate > (best.winRate || 0) ? { type, winRate, profit: data.profit } : best;
    }, {} as any);

    if (bestBetType.type) {
      insights.push({
        type: 'info',
        title: 'Best Bet Type',
        message: `${bestBetType.type} bets are your strongest with ${(bestBetType.winRate * 100).toFixed(1)}% win rate. Consider focusing more on these.`,
        icon: '💡'
      });
    }

    // Stake size analysis
    const avgStake = bets.reduce((sum, bet) => sum + bet.stake, 0) / bets.length;
    if (avgStake > 50) {
      insights.push({
        type: 'warning',
        title: 'Stake Size Alert',
        message: `Your average stake of $${avgStake.toFixed(2)} is high. Consider reducing bet sizes to manage risk better.`,
        icon: '💰'
      });
    }

    // Recent performance
    const recentBets = settledBets.slice(-5);
    const recentWins = recentBets.filter(bet => bet.result === 'win').length;
    
    if (recentWins >= 4) {
      insights.push({
        type: 'success',
        title: 'Hot Streak',
        message: `You've won ${recentWins} of your last 5 bets! Stay disciplined and don't increase stakes dramatically.`,
        icon: '🔥'
      });
    } else if (recentWins <= 1) {
      insights.push({
        type: 'warning',
        title: 'Cold Streak',
        message: `Only ${recentWins} wins in your last 5 bets. Consider taking a break or reducing stake sizes.`,
        icon: '❄️'
      });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="card">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-xl">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">AI Insights</h2>
          <p className="text-sm text-gray-400">Personalized betting recommendations</p>
        </div>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Add more bets for insights</h3>
          <p className="text-gray-400">AI needs at least 5 settled bets to generate personalized recommendations</p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-2xl border-l-4 ${
                insight.type === 'success' ? 'bg-emerald-900/20 border-emerald-500' :
                insight.type === 'warning' ? 'bg-amber-900/20 border-amber-500' :
                'bg-blue-900/20 border-blue-500'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{insight.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{insight.title}</h3>
                  <p className="text-gray-300">{insight.message}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* AI Recommendations */}
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <span>🤖</span>
              <span>AI Recommendations</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">Focus on NBA moneyline bets - your strongest market</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">Reduce stake size by 20% during losing streaks</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">Avoid betting on back-to-back days - take breaks</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}