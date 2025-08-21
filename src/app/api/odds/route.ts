import { NextRequest, NextResponse } from 'next/server';

const SPORTS_API_BASE = 'https://api.the-odds-api.com/v4';
const API_KEY = process.env.ODDS_API_KEY; // Server-side only

export async function POST(request: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const { sport, markets } = await request.json();

    // Input validation
    if (!sport || !markets) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedSport = sport.replace(/[^a-z_]/g, '');
    const sanitizedMarkets = markets.replace(/[^a-z_,]/g, '');

    const response = await fetch(
      `${SPORTS_API_BASE}/sports/${sanitizedSport}/odds/?apiKey=${API_KEY}&regions=us&markets=${sanitizedMarkets}&oddsFormat=american&bookmakers=fanduel`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'External API error' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Odds API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}