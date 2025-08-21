'use client';

import { useState, useEffect, useMemo } from 'react';
import { Game, fetchLiveGames, getSportsList, getBettingMarkets } from '@/lib/sportsApi';
import { format } from 'date-fns';
import LoadingSpinner from './LoadingSpinner';

const QuickAddTooltip = (
  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
    Quick add to betting tracker
  </div>
);

interface LiveGamesProps {
  onQuickBet: (game: Game, team: string, odds: number) => void;
}

export default function LiveGames({ onQuickBet }: LiveGamesProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedSport, setSelectedSport] = useState('americanfootball_nfl');
  const [selectedMarkets, setSelectedMarkets] = useState('h2h,spreads,totals');
  const [dateFilter, setDateFilter] = useState('today');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, [selectedSport, selectedMarkets, dateFilter]);

  const loadGames = async () => {
    setLoading(true);
    try {
      const gamesData = await fetchLiveGames(selectedSport, selectedMarkets);
      setGames(Array.isArray(gamesData) ? gamesData : []);
    } catch (error) {
      console.error('Error loading games:', error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    let filtered = games.filter(game => {
      const gameDate = new Date(game.commence_time);
      
      switch (dateFilter) {
        case 'today':
          return gameDate >= today && gameDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
        case 'week':
          return gameDate >= today && gameDate <= weekFromNow;
        case 'month':
          return gameDate >= today && gameDate <= monthFromNow;
        default:
          return true;
      }
    });

    // Sanitize selectedTeam to prevent injection
    if (selectedTeam) {
      const sanitizedTeam = selectedTeam.replace(/[^a-zA-Z0-9\s-]/g, '').trim();
      if (sanitizedTeam) {
        filtered = filtered.filter(game => 
          game.home_team === sanitizedTeam || game.away_team === sanitizedTeam
        );
      }
    }

    return filtered;
  }, [games, dateFilter, selectedTeam]);

  const getAvailableTeams = () => {
    const teams = new Set<string>();
    games.forEach(game => {
      teams.add(game.home_team);
      teams.add(game.away_team);
    });
    return Array.from(teams).sort();
  };

  const handleQuickBet = (game: Game, team: string, odds: number) => {
    onQuickBet(game, team, odds);
  };

  const getOddsForTeam = (game: Game, team: string) => {
    if (!game.bookmakers?.[0]?.markets?.[0]?.outcomes) return null;
    return game.bookmakers[0].markets[0].outcomes.find(outcome => outcome.name === team);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 rounded-xl flex items-center justify-center shadow-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Live Games</h2>
            <p className="text-sm text-gray-400">Real-time odds and quick add</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="input-field text-sm py-2 px-3"
          >
            {getSportsList().map(sport => (
              <option key={sport.key} value={sport.key}>{sport.title}</option>
            ))}
          </select>
          
          <select
            value={selectedMarkets}
            onChange={(e) => setSelectedMarkets(e.target.value)}
            className="input-field text-sm py-2 px-3"
          >
            <option value="h2h">Moneyline</option>
            <option value="h2h,spreads">Moneyline + Spreads</option>
            <option value="h2h,totals">Moneyline + Totals</option>
            <option value="h2h,spreads,totals">All Markets</option>
            <option value="spreads">Spreads Only</option>
            <option value="totals">Totals Only</option>
          </select>
          
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="input-field text-sm py-2 px-3"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="input-field text-sm py-2 px-3 min-w-40"
          >
            <option value="">All Teams</option>
            {getAvailableTeams().map(team => {
              const sanitizedTeam = team.replace(/[^a-zA-Z0-9\s-]/g, '').trim();
              return (
                <option key={sanitizedTeam} value={sanitizedTeam}>{sanitizedTeam}</option>
              );
            })}
          </select>
          
          <button
            onClick={loadGames}
            className="btn-secondary text-sm py-2 px-4"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading live games..." />
      ) : filteredGames.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No games available</h3>
          <p className="text-gray-400">Try selecting a different sport or check back later</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGames.map((game) => (
            <div key={game.id} className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{game.sport_title}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{game.away_team} @ {game.home_team}</p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(game.commence_time), 'MMM dd, h:mm a')}
                    </p>
                  </div>
                </div>
                
                {game.bookmakers?.[0] && (
                  <div className="text-xs text-cyan-400 font-semibold">
                    {game.bookmakers[0].title}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Away Team */}
                <div className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-700/50 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{game.away_team}</p>
                      <p className="text-xs text-gray-400">Away</p>
                    </div>
                    <div className="text-right">
                      {(() => {
                        const odds = getOddsForTeam(game, game.away_team);
                        return odds ? (
                          <div>
                            <p className="text-lg font-black text-cyan-400">
                              {odds.price > 0 ? '+' : ''}{odds.price}
                            </p>
                            <button
                              onClick={() => handleQuickBet(game, game.away_team, odds.price)}
                              className="text-xs bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-1 px-3 rounded-lg transition-all duration-200 mt-1 relative group"
                              title="Quick add to betting tracker"
                            >
                              Quick Add
                              {QuickAddTooltip}
                            </button>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No odds</p>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Home Team */}
                <div className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-700/50 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{game.home_team}</p>
                      <p className="text-xs text-gray-400">Home</p>
                    </div>
                    <div className="text-right">
                      {(() => {
                        const odds = getOddsForTeam(game, game.home_team);
                        return odds ? (
                          <div>
                            <p className="text-lg font-black text-cyan-400">
                              {odds.price > 0 ? '+' : ''}{odds.price}
                            </p>
                            <button
                              onClick={() => handleQuickBet(game, game.home_team, odds.price)}
                              className="text-xs bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-1 px-3 rounded-lg transition-all duration-200 mt-1 relative group"
                              title="Quick add to betting tracker"
                            >
                              Quick Add
                              {QuickAddTooltip}
                            </button>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No odds</p>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}