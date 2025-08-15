'use client';

import { useState, useEffect } from 'react';
import { loadBets } from '@/lib/storage';
import { Bet } from '@/types';

export default function ExportPage() {
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    setBets(loadBets());
  }, []);

  const exportToCSV = () => {
    const headers = ['Date', 'Sport', 'Team', 'Opponent', 'Bet Type', 'Odds', 'Stake', 'Result', 'Payout', 'Profit/Loss', 'Notes'];
    
    const csvData = bets.map(bet => [
      bet.date,
      bet.sport,
      bet.team,
      bet.opponent,
      bet.betType,
      bet.odds,
      bet.stake,
      bet.result || 'Pending',
      bet.payout || '',
      bet.result === 'win' ? ((bet.payout || 0) - bet.stake).toFixed(2) :
      bet.result === 'loss' ? (-bet.stake).toFixed(2) : '0.00',
      bet.notes || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bettracker-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="card">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Export Data</h1>
            <p className="text-gray-400">Download your betting history</p>
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">CSV Export</h3>
          <p className="text-gray-300 mb-6">Export your data as a CSV file for use in Excel or Google Sheets.</p>
          <button 
            onClick={exportToCSV}
            className="btn-primary"
            disabled={bets.length === 0}
          >
            Download CSV ({bets.length} bets)
          </button>
        </div>

        {bets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No betting data to export. Add some bets first!</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <a href="/" className="text-cyan-400 hover:text-cyan-300 font-semibold">← Back to Dashboard</a>
        </div>
      </div>
    </div>
  );
}