import { NextRequest, NextResponse } from 'next/server';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 100; // requests per window
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  
  // Rate limiting
  const key = `rate_limit:${ip}`;
  const current = rateLimitStore.get(key);
  
  if (current && now < current.resetTime) {
    if (current.count >= RATE_LIMIT) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
    current.count++;
  } else {
    rateLimitStore.set(key, { count: 1, resetTime: now + WINDOW_MS });
  }
  
  // CSRF protection for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    if (request.method !== 'GET' && origin && !origin.includes(host || '')) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*']
};