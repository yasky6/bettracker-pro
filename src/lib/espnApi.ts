// ESPN API integration (free, no key required)
const ESPN_API_BASE = 'https://site.api.espn.com/apis/site/v2/sports';

export interface ESPNGame {
  id: string;
  name: string;
  shortName: string;
  date: string;
  status: {
    type: {
      name: string;
      state: string;
    };
  };
  competitions: Array<{
    competitors: Array<{
      team: {
        displayName: string;
        abbreviation: string;
        logo: string;
      };
      score: string;
      homeAway: string;
    }>;
    odds?: Array<{
      provider: {
        name: string;
      };
      details: string;
      overUnder: number;
    }>;
  }>;
}

export interface ESPNScoreboard {
  events: ESPNGame[];
}

// ESPN Sports mapping
export const ESPN_SPORTS = {
  nfl: 'football/nfl',
  nba: 'basketball/nba',
  mlb: 'baseball/mlb',
  nhl: 'hockey/nhl',
  ncaaf: 'football/college-football',
  ncaab: 'basketball/mens-college-basketball',
  soccer: 'soccer/usa.1'
};

export const fetchESPNScoreboard = async (sport: keyof typeof ESPN_SPORTS): Promise<ESPNGame[]> => {
  try {
    const response = await fetch(`${ESPN_API_BASE}/${ESPN_SPORTS[sport]}/scoreboard`);
    
    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status}`);
    }
    
    const data: ESPNScoreboard = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('ESPN API error:', error);
    return [];
  }
};

export const fetchESPNTeamStats = async (sport: keyof typeof ESPN_SPORTS, teamId: string) => {
  try {
    const response = await fetch(`${ESPN_API_BASE}/${ESPN_SPORTS[sport]}/teams/${teamId}`);
    
    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('ESPN team stats error:', error);
    return null;
  }
};

export const fetchESPNNews = async (sport: keyof typeof ESPN_SPORTS) => {
  try {
    const response = await fetch(`${ESPN_API_BASE}/${ESPN_SPORTS[sport]}/news`);
    
    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('ESPN news error:', error);
    return [];
  }
};