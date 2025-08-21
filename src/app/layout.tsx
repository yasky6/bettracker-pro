import './globals.css'
import { Inter } from 'next/font/google'
import Logo from '@/components/Logo'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BetTracker Pro - Professional Sports Betting Analytics',
  description: 'Track your sports bets, analyze performance, and improve your ROI with real-time odds, advanced charts, and AI insights. Free plan available.',
  keywords: 'sports betting tracker, betting analytics, ROI calculator, bet tracking app, gambling tracker, sports betting statistics',
  authors: [{ name: 'BetTracker Pro' }],
  creator: 'BetTracker Pro',
  publisher: 'BetTracker Pro',
  robots: 'index, follow',
  openGraph: {
    title: 'BetTracker Pro - Professional Sports Betting Analytics',
    description: 'Track your sports bets and analyze your performance with professional-grade tools.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://bettracker.pro',
    siteName: 'BetTracker Pro',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BetTracker Pro - Professional Sports Betting Analytics',
    description: 'Track your sports bets and analyze your performance with professional-grade tools.',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0891b2',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
          <nav className="bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-20">
                <a href="/" className="hover:opacity-90 transition-opacity duration-200">
                  <Logo size="md" variant="full" />
                </a>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-300">Free Plan</span>
                  </div>
                  <a href="/signup" className="btn-secondary text-sm py-2 px-4">
                    Sign Up
                  </a>
                  <a href="/upgrade" className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-cyan-500/25 inline-flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Upgrade to Pro</span>
                  </a>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
          
          <footer className="bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-6">
                  <a href="/export" className="text-gray-400 hover:text-white transition-colors">Export Data</a>
                  <a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</a>
                  <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
                </div>
                <div className="text-gray-500 text-sm">
                  <p>© 2024 BetTracker Pro. Gamble responsibly. 18+</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}