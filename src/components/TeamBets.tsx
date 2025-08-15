'use client';

import { useState, useEffect } from 'react';
import { Game, fetchLiveGames, getSportsList } from '@/lib/sportsApi';

interface TeamBetsProps {
  onQuickBet: (game: Game, team: string, odds: number) => void;
}

export default function TeamBets({ onQuickBet }: TeamBetsProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [availableTeams, setAvailableTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllGames();
  }, []);

  const loadAllGames = async () => {
    setLoading(true);
    const allGames: Game[] = [];
    const sports = getSportsList();
    
    for (const sport of sports.slice(0, 4)) { // Load first 4 sports
      const sportGames = await fetchLiveGames(sport.key, 'h2h,spreads,totals');
      allGames.push(...sportGames);
    }
    
    setGames(allGames);
    
    // Extract unique teams
    const teams = new Set<string>();
    allGames.forEach(game => {
      teams.add(game.home_team);
      teams.add(game.away_team);
    });
    
    setAvailableTeams(Array.from(teams).sort());
    setLoading(false);
  };

  const getTeamBets = () => {
    if (!selectedTeam) return [];
    
    return games.filter(game => 
      game.home_team === selectedTeam || game.away_team === selectedTeam
    );
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Team Bets</h2>
            <p className="text-sm text-gray-400">All available bets for a specific team</p>
          </div>
        </div>
        
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="input-field text-sm py-2 px-3 min-w-48"
        >
          <option value="">Select a team</option>
          {availableTeams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading teams...</p>
        </div>
      ) : !selectedTeam ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Select a team</h3>
          <p className="text-gray-400">Choose a team to see all their available bets</p>
        </div>
      ) : (
        <div className="space-y-4">
          {getTeamBets().map((game) => (
            <div key={game.id} className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-bold text-white">{game.away_team} @ {game.home_team}</p>
                  <p className="text-sm text-gray-400">{game.sport_title}</p>
                </div>
                <div className="text-xs text-cyan-400 font-semibold">
                  {game.bookmakers?.[0]?.title || 'FanDuel'}
                </div>
              </div>

              <div className="space-y-3">
                {game.bookmakers?.[0]?.markets?.map((market, marketIndex) => (
                  <div key={marketIndex} className="bg-gray-800/50 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-cyan-400 mb-3">
                      {market.key === 'h2h' ? 'Moneyline' : 
                       market.key === 'spreads' ? 'Point Spread' :
                       market.key === 'totals' ? 'Over/Under' : market.key}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {market.outcomes
                        .filter(outcome => 
                          outcome.name === selectedTeam || 
                          market.key === 'totals'
                        )
                        .map((outcome, outcomeIndex) => (
                        <div key={outcomeIndex} className="bg-gray-800/70 rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-white">
                              {outcome.name}
                              {outcome.point && (
                                <span className="text-xs text-gray-400 ml-2">
                                  ({outcome.point > 0 ? '+' : ''}{outcome.point})
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <p className="text-lg font-black text-cyan-400">
                              {outcome.price > 0 ? '+' : ''}{outcome.price}
                            </p>
                            <button
                              onClick={() => onQuickBet(game, outcome.name, outcome.price)}
                              className="text-xs bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-1 px-3 rounded-lg transition-all duration-200"
                            >
                              Quick Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}