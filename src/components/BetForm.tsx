'use client';

import { useState } from 'react';
import { Bet } from '@/types';

interface BetFormProps {
  onAddBet: (bet: Omit<Bet, 'id'>) => void;
}

export default function BetForm({ onAddBet }: BetFormProps) {
  const [formData, setFormData] = useState({
    sport: '',
    team: '',
    opponent: '',
    betType: 'moneyline' as const,
    odds: '',
    stake: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bet: Omit<Bet, 'id'> = {
      ...formData,
      odds: parseFloat(formData.odds),
      stake: parseFloat(formData.stake),
      date: new Date().toISOString().split('T')[0]
    };
    
    onAddBet(bet);
    setFormData({
      sport: '',
      team: '',
      opponent: '',
      betType: 'moneyline',
      odds: '',
      stake: '',
      notes: ''
    });
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Add New Bet</h2>
          <p className="text-sm text-gray-400">Track your next winning bet</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
              Sport
            </label>
            <select
              value={formData.sport}
              onChange={(e) => setFormData({...formData, sport: e.target.value})}
              className="input-field"
              required
            >
              <option value="">Select Sport</option>
              <option value="NFL">NFL</option>
              <option value="NBA">NBA</option>
              <option value="MLB">MLB</option>
              <option value="NHL">NHL</option>
              <option value="Soccer">Soccer</option>
              <option value="Tennis">Tennis</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
              Bet Type
            </label>
            <select
              value={formData.betType}
              onChange={(e) => setFormData({...formData, betType: e.target.value as any})}
              className="input-field"
            >
              <option value="moneyline">Moneyline</option>
              <option value="spread">Spread</option>
              <option value="over_under">Over/Under</option>
              <option value="prop">Prop Bet</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
              Team
            </label>
            <input
              type="text"
              value={formData.team}
              onChange={(e) => setFormData({...formData, team: e.target.value})}
              className="input-field"
              placeholder="e.g., Lakers"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
              Opponent
            </label>
            <input
              type="text"
              value={formData.opponent}
              onChange={(e) => setFormData({...formData, opponent: e.target.value})}
              className="input-field"
              placeholder="e.g., Warriors"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
              Odds (American)
            </label>
            <input
              type="number"
              value={formData.odds}
              onChange={(e) => setFormData({...formData, odds: e.target.value})}
              className="input-field"
              placeholder="e.g., -110 or +150"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
              Stake ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.stake}
              onChange={(e) => setFormData({...formData, stake: e.target.value})}
              className="input-field"
              placeholder="e.g., 25.00"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="input-field resize-none"
            rows={3}
            placeholder="Any additional notes..."
          />
        </div>

        <button type="submit" className="btn-primary w-full text-xl font-black py-5 mt-8">
          <span className="flex items-center justify-center space-x-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Bet</span>
          </span>
        </button>
      </form>
    </div>
  );
}