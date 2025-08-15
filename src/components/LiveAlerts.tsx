'use client';

import { useState } from 'react';

export default function LiveAlerts() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'odds_change',
      title: 'Odds Movement Alert',
      message: 'Lakers vs Warriors: Lakers moved from -110 to -125',
      time: '2 minutes ago',
      active: true
    },
    {
      id: 2,
      type: 'value_bet',
      title: 'Value Bet Detected',
      message: 'Chiefs +150 - 15% above fair value',
      time: '5 minutes ago',
      active: true
    },
    {
      id: 3,
      type: 'injury_news',
      title: 'Injury Update',
      message: 'Star player questionable for tonight\'s game',
      time: '12 minutes ago',
      active: false
    }
  ]);

  const [alertSettings, setAlertSettings] = useState({
    oddsMovement: true,
    valueBets: true,
    injuryNews: true,
    lineMovement: false,
    weatherAlerts: false
  });

  return (
    <div className="card">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-xl">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-5 5v-5zM12 17h-7a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v6M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m8-2v2a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h2" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Live Alerts</h2>
          <p className="text-sm text-gray-400">Real-time betting notifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Alerts */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-xl border-l-4 ${
                  alert.type === 'odds_change' ? 'bg-blue-900/20 border-blue-500' :
                  alert.type === 'value_bet' ? 'bg-emerald-900/20 border-emerald-500' :
                  'bg-amber-900/20 border-amber-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-bold text-white text-sm">{alert.title}</h4>
                      {alert.active && (
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{alert.message}</p>
                    <p className="text-gray-500 text-xs">{alert.time}</p>
                  </div>
                  <button className="text-gray-400 hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Settings */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Alert Settings</h3>
          <div className="space-y-4">
            {Object.entries(alertSettings).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                <div>
                  <h4 className="font-semibold text-white capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {key === 'oddsMovement' && 'Get notified when odds change significantly'}
                    {key === 'valueBets' && 'Alert when value betting opportunities arise'}
                    {key === 'injuryNews' && 'Breaking injury news affecting your bets'}
                    {key === 'lineMovement' && 'Point spread and total line movements'}
                    {key === 'weatherAlerts' && 'Weather conditions affecting outdoor games'}
                  </p>
                </div>
                <button
                  onClick={() => setAlertSettings(prev => ({ ...prev, [key]: !enabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enabled ? 'bg-emerald-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Alert Frequency */}
          <div className="mt-6 p-4 bg-gray-800/30 rounded-xl">
            <h4 className="font-semibold text-white mb-3">Alert Frequency</h4>
            <select className="input-field w-full">
              <option value="instant">Instant</option>
              <option value="hourly">Hourly Summary</option>
              <option value="daily">Daily Summary</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}