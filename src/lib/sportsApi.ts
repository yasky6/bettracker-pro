// Free sports API integration
const SPORTS_API_BASE = 'https://api.the-odds-api.com/v4';
const API_KEY = process.env.NEXT_PUBLIC_ODDS_API_KEY || 'YOUR_API_KEY';

export interface Game {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers?: Bookmaker[];
}

export interface Bookmaker {
  key: string;
  title: string;
  markets: Market[];
}

export interface Market {
  key: string;
  outcomes: Outcome[];
  last_update?: string;
}

export interface Outcome {
  name: string;
  price: number;
  point?: number; // For spreads and totals
}

export const fetchLiveGames = async (sport = 'americanfootball_nfl', markets = 'h2h,spreads,totals'): Promise<Game[]> => {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
    console.warn('Add your API key to .env.local to see real FanDuel odds');
    return [];
  }
  
  try {
    const response = await fetch(
      `${SPORTS_API_BASE}/sports/${sport}/odds/?apiKey=${API_KEY}&regions=us&markets=${markets}&oddsFormat=american&bookmakers=fanduel`
    );
    
    if (!response.ok) {
      console.error(`FanDuel API error: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('FanDuel API error:', error);
    return [];
  }
};



// All sports FanDuel supports
export const getSportsList = () => [
  { key: 'americanfootball_nfl', title: 'NFL' },
  { key: 'americanfootball_ncaaf', title: 'College Football' },
  { key: 'basketball_nba', title: 'NBA' },
  { key: 'basketball_ncaab', title: 'College Basketball' },
  { key: 'basketball_wnba', title: 'WNBA' },
  { key: 'baseball_mlb', title: 'MLB' },
  { key: 'icehockey_nhl', title: 'NHL' },
  { key: 'soccer_epl', title: 'Premier League' },
  { key: 'soccer_uefa_champs_league', title: 'Champions League' },
  { key: 'soccer_fifa_world_cup', title: 'World Cup' },
  { key: 'soccer_usa_mls', title: 'MLS' },
  { key: 'tennis_atp', title: 'Tennis ATP' },
  { key: 'tennis_wta', title: 'Tennis WTA' },
  { key: 'mma_mixed_martial_arts', title: 'UFC/MMA' },
  { key: 'boxing_boxing', title: 'Boxing' },
  { key: 'golf_pga_championship', title: 'PGA Golf' },
  { key: 'americanfootball_cfl', title: 'CFL' },
  { key: 'cricket_icc_world_cup', title: 'Cricket' },
  { key: 'aussierules_afl', title: 'AFL' },
  { key: 'rugbyleague_nrl', title: 'Rugby League' }
];

// All betting markets FanDuel supports
export const getBettingMarkets = () => [
  { key: 'h2h', title: 'Moneyline', description: 'Pick the winner' },
  { key: 'spreads', title: 'Point Spread', description: 'Handicap betting' },
  { key: 'totals', title: 'Over/Under', description: 'Total points scored' },
  { key: 'outrights', title: 'Futures', description: 'Season/tournament winner' },
  { key: 'player_props', title: 'Player Props', description: 'Individual player stats' },
  { key: 'team_props', title: 'Team Props', description: 'Team-specific bets' },
  { key: 'alternate_spreads', title: 'Alt Spreads', description: 'Alternative point spreads' },
  { key: 'alternate_totals', title: 'Alt Totals', description: 'Alternative over/under' }
];