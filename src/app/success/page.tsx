'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Update user to Pro plan
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.plan = 'pro';
      user.stripeSessionId = sessionId;
      user.subscriptionDate = new Date().toISOString();
      localStorage.setItem('user', JSON.stringify(user));
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Welcome to Pro! 🎉</h1>
        <p className="text-gray-400 mb-8 max-w-md">Your subscription is now active. Enjoy unlimited bet tracking and advanced features!</p>
        
        <div className="bg-gray-800/30 rounded-2xl p-6 mb-8 max-w-md mx-auto">
          <h3 className="text-xl font-bold text-white mb-4">Pro Features Unlocked:</h3>
          <ul className="text-left space-y-2 text-gray-300">
            <li>✅ Unlimited bet tracking</li>
            <li>✅ Advanced analytics & charts</li>
            <li>✅ AI betting insights</li>
            <li>✅ Live odds alerts</li>
            <li>✅ Priority support</li>
          </ul>
        </div>

        <a href="/" className="btn-primary">
          Start Tracking Bets
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}