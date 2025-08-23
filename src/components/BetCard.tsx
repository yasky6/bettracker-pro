import React from 'react';
import { Bet } from '@/types';

interface BetCardProps {
  bet: Bet;
  onUpdateBet: (id: string, result: 'win' | 'loss' | 'push', payout?: number) => void;
  onDeleteBet: (id: string) => void;
}

// Memoized BetCard component for better performance
const BetCard = React.memo(({ bet, onUpdateBet, onDeleteBet }: BetCardProps) => {
  const isSettled = bet.result !== undefined;
  const potentialPayout = bet.odds > 0 ? bet.stake * (bet.odds / 100) : bet.stake * (100 / Math.abs(bet.odds));
  
  const getResultColor = (result?: string) => {
    switch (result) {
      case 'win': return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'loss': return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'push': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getResultIcon = (result?: string) => {
    switch (result) {
      case 'win':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'loss':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'push':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="card hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-bold text-white">{bet.team}</h3>
            <span className="text-sm text-gray-400">vs {bet.opponent}</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="bg-gray-800 px-2 py-1 rounded">{bet.sport}</span>
            <span className="bg-gray-800 px-2 py-1 rounded">{bet.betType}</span>
            <span>{new Date(bet.date).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getResultColor(bet.result)}`}>
          {getResultIcon(bet.result)}
          <span className="font-medium">
            {bet.result ? bet.result.toUpperCase() : 'PENDING'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Stake</p>
          <p className="text-lg font-bold text-white">${bet.stake}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Odds</p>
          <p className="text-lg font-bold text-cyan-400">
            {bet.odds > 0 ? `+${bet.odds}` : bet.odds}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Potential</p>
          <p className="text-lg font-bold text-green-400">
            ${(bet.stake + potentialPayout).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Profit</p>
          <p className="text-lg font-bold text-yellow-400">
            ${potentialPayout.toFixed(2)}
          </p>
        </div>
      </div>

      {bet.notes && (
        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
          <p className="text-sm text-gray-300">{bet.notes}</p>
        </div>
      )}

      {bet.result && bet.payout && (
        <div className="mb-4 p-3 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg border border-green-500/20">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Actual Payout:</span>
            <span className="text-lg font-bold text-green-400">${bet.payout}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-300">Net Profit:</span>
            <span className={`text-lg font-bold ${bet.payout > bet.stake ? 'text-green-400' : 'text-red-400'}`}>
              ${(bet.payout - bet.stake).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {!isSettled && (
        <div className="flex space-x-2">
          <button
            onClick={() => onUpdateBet(bet.id, 'win', bet.stake + potentialPayout)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Win
          </button>
          <button
            onClick={() => onUpdateBet(bet.id, 'loss', 0)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Loss
          </button>
          <button
            onClick={() => onUpdateBet(bet.id, 'push', bet.stake)}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Push
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
        <button
          onClick={() => onDeleteBet(bet.id)}
          className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
        >
          Delete Bet
        </button>
        {isSettled && (
          <span className="text-xs text-gray-500">
            Settled on {new Date(bet.date).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
});

BetCard.displayName = 'BetCard';

export default BetCard;
