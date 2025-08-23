'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('PWA: Service Worker registered successfully:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available
                  toast((t) => (
                    <div className="flex flex-col space-y-3">
                      <p className="font-medium">New version available!</p>
                      <p className="text-sm text-gray-300">Refresh to get the latest features</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            toast.dismiss(t.id);
                            window.location.reload();
                          }}
                          className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded text-sm font-medium"
                        >
                          Refresh Now
                        </button>
                        <button
                          onClick={() => toast.dismiss(t.id)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Later
                        </button>
                      </div>
                    </div>
                  ), { duration: 10000 });
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('PWA: Service Worker registration failed:', error);
        });
    }

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      
      // Show install prompt after a delay
      setTimeout(() => {
        showInstallPrompt();
      }, 30000); // Show after 30 seconds
    };

    // Handle app installed
    const handleAppInstalled = () => {
      console.log('PWA: App was installed');
      setDeferredPrompt(null);
      setIsInstallable(false);
      toast.success('BetTracker Pro installed successfully! 🎉');
    };

    // Handle online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online! Data will sync automatically.');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast((t) => (
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
          <span>You're offline. Changes will sync when reconnected.</span>
        </div>
      ), { duration: 5000 });
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial online status
    setIsOnline(navigator.onLine);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showInstallPrompt = () => {
    if (!deferredPrompt || !isInstallable) return;

    toast((t) => (
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Install BetTracker Pro</p>
            <p className="text-sm text-gray-300">Get the full app experience</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`PWA: User ${outcome} the install prompt`);
                setDeferredPrompt(null);
                setIsInstallable(false);
              }
            }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
          >
            Install App
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setIsInstallable(false);
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Not Now
          </button>
        </div>
      </div>
    ), { duration: 15000 });
  };

  // Manual install trigger (can be called from UI)
  const triggerInstall = () => {
    if (isInstallable) {
      showInstallPrompt();
    }
  };

  // Provide PWA context to children
  const pwaContext = {
    isInstallable,
    isOnline,
    triggerInstall
  };

  return (
    <>
      {children}
      
      {/* Online/Offline Indicator */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className="bg-orange-900/90 backdrop-blur-sm border border-orange-500/30 rounded-lg px-4 py-2 flex items-center space-x-3">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="text-orange-200 text-sm font-medium">Offline Mode</span>
          </div>
        </div>
      )}

      {/* Install Button (floating) */}
      {isInstallable && (
        <button
          onClick={triggerInstall}
          className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white p-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110"
          title="Install BetTracker Pro"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </button>
      )}
    </>
  );
}

// Hook to use PWA context
export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isInstallable, isOnline };
}
