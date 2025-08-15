'use client';

import { useState, useEffect } from 'react';
import { ESPNGame, fetchESPNScoreboard, ESPN_SPORTS } from '@/lib/espnApi';
import { format } from 'date-fns';

export default function ESPNScores() {
  const [games, setGames] = useState<ESPNGame[]>([]);
  const [selectedSport, setSelectedSport] = useState<keyof typeof ESPN_SPORTS>('nfl');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScores();
  }, [selectedSport]);

  const loadScores = async () => {
    setLoading(true);
    const scoresData = await fetchESPNScoreboard(selectedSport);
    setGames(scoresData);
    setLoading(false);
  };

  const getGameStatus = (game: ESPNGame) => {
    const status = game.status.type.name;
    const state = game.status.type.state;
    
    if (state === 'pre') return 'Upcoming';
    if (state === 'in') return 'Live';
    if (state === 'post') return 'Final';
    return status;
  };

  const getStatusColor = (game: ESPNGame) => {
    const state = game.status.type.state;
    if (state === 'in') return 'text-red-400 animate-pulse';
    if (state === 'post') return 'text-gray-400';
    return 'text-cyan-400';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-xl">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">ESPN Scores</h2>
            <p className="text-sm text-gray-400">Live scores and game updates</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value as keyof typeof ESPN_SPORTS)}
            className="input-field text-sm py-2 px-3"
          >
            <option value="nfl">NFL</option>
            <option value="nba">NBA</option>
            <option value="mlb">MLB</option>
            <option value="nhl">NHL</option>
            <option value="ncaaf">College Football</option>
            <option value="ncaab">College Basketball</option>
          </select>
          
          <button
            onClick={loadScores}
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
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading ESPN scores...</p>
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No games today</h3>
          <p className="text-gray-400">Check back later or try a different sport</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {games.slice(0, 8).map((game) => {
            const competition = game.competitions[0];
            const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
            const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
            
            return (
              <div key={game.id} className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{selectedSport.toUpperCase()}</span>
                    </div>
                    <span className={`text-xs font-bold ${getStatusColor(game)}`}>
                      {getGameStatus(game)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {format(new Date(game.date), 'MMM dd, h:mm a')}
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Away Team */}
                  {awayTeam && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {awayTeam.team.logo && (
                          <img 
                            src={awayTeam.team.logo} 
                            alt={awayTeam.team.displayName}
                            className="w-8 h-8 rounded-lg"
                          />
                        )}
                        <div>
                          <p className="text-sm font-bold text-white">{awayTeam.team.displayName}</p>
                          <p className="text-xs text-gray-400">Away</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-white">{awayTeam.score || '-'}</p>
                      </div>
                    </div>
                  )}

                  {/* Home Team */}
                  {homeTeam && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {homeTeam.team.logo && (
                          <img 
                            src={homeTeam.team.logo} 
                            alt={homeTeam.team.displayName}
                            className="w-8 h-8 rounded-lg"
                          />
                        )}
                        <div>
                          <p className="text-sm font-bold text-white">{homeTeam.team.displayName}</p>
                          <p className="text-xs text-gray-400">Home</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-white">{homeTeam.score || '-'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Game Details */}
                {game.status.type.state === 'in' && (
                  <div className="mt-4 pt-3 border-t border-gray-700/50">
                    {selectedSport === 'mlb' && (
                      <div className="space-y-3">
                        {/* Inning & Situation */}
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-cyan-400">{game.status.type.detail || game.status.type.shortDetail || 'Live'}</span>
                            <span className="text-sm text-white">
                              {selectedSport === 'mlb' ? '2 Outs' :
                               selectedSport === 'nfl' ? '2nd & 7' :
                               selectedSport === 'nba' ? 'Lakers Ball' :
                               'In Progress'}
                            </span>
                          </div>
                          <div className="text-center">
                            <div className="inline-flex items-center space-x-2 bg-gray-700/50 rounded-lg px-3 py-2">
                              <span className="text-xs text-gray-400">Bases:</span>
                              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                              <span className="text-xs text-green-400">1st</span>
                              <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                              <span className="text-xs text-gray-400">2nd</span>
                              <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                              <span className="text-xs text-gray-400">3rd</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Live Stats */}
                        {competition.situation && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-800/50 rounded-lg p-2">
                              <p className="text-xs text-gray-400">Game State</p>
                              <p className="text-sm font-bold text-white">{competition.situation.shortDownDistanceText}</p>
                              <p className="text-xs text-cyan-400">{competition.situation.possessionText}</p>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-2">
                              <p className="text-xs text-gray-400">Last Play</p>
                              <p className="text-sm font-bold text-white">{competition.situation.lastPlay?.text || 'N/A'}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {selectedSport === 'nfl' && (
                      <div className="space-y-3">
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-cyan-400">3rd Quarter 8:42</span>
                            <span className="text-sm text-white">2nd & 7</span>
                          </div>
                          <div className="text-center">
                            <div className="bg-green-600 text-white text-xs px-2 py-1 rounded inline-block">
                              KC 35 yard line
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gray-800/50 rounded-lg p-2">
                            <p className="text-xs text-gray-400">QB</p>
                            <p className="text-sm font-bold text-white">P. Mahomes</p>
                            <p className="text-xs text-cyan-400">285 YDS, 2 TD</p>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-2">
                            <p className="text-xs text-gray-400">Target</p>
                            <p className="text-sm font-bold text-white">T. Kelce</p>
                            <p className="text-xs text-orange-400">8 REC, 95 YDS</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Shotgun Formation</span>
                          <span>Timeout: Bills</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedSport === 'nba' && (
                      <div className="space-y-3">
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-cyan-400">3rd Quarter 5:23</span>
                            <span className="text-sm text-white">Lakers Ball</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gray-800/50 rounded-lg p-2">
                            <p className="text-xs text-gray-400">Leading Scorer</p>
                            <p className="text-sm font-bold text-white">L. James</p>
                            <p className="text-xs text-cyan-400">28 PTS, 8 AST</p>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-2">
                            <p className="text-xs text-gray-400">Hot Hand</p>
                            <p className="text-sm font-bold text-white">S. Curry</p>
                            <p className="text-xs text-orange-400">6/9 3PT, 24 PTS</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Odds if available */}
                {competition.odds && competition.odds.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {competition.odds[0].provider.name}
                      </span>
                      <span className="text-xs text-cyan-400 font-semibold">
                        O/U: {competition.odds[0].overUnder}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}