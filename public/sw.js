// BetTracker Pro Service Worker
const CACHE_NAME = 'bettracker-pro-v1';
const STATIC_CACHE = 'bettracker-static-v1';
const DYNAMIC_CACHE = 'bettracker-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/login',
  '/signup',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API endpoints that should be cached
const CACHEABLE_APIS = [
  '/api/auth/session',
  '/api/bets'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Handle other requests (static assets, etc.)
  event.respondWith(handleStaticRequest(request));
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful GET requests
    if (request.method === 'GET' && networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache for', url.pathname);
    
    // If network fails, try cache for GET requests
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    // For failed POST/PUT/DELETE requests, store for background sync
    if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
      await storeFailedRequest(request);
    }
    
    // Return offline response
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'You are currently offline. Changes will be synced when you reconnect.' 
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle navigation requests with cache-first for offline support
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache the response
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // If network fails, serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page
    const offlineResponse = await caches.match('/');
    return offlineResponse || new Response('Offline', { status: 503 });
  }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // If not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    // Cache the response
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // Return offline fallback
    return new Response('Offline', { status: 503 });
  }
}

// Store failed requests for background sync
async function storeFailedRequest(request) {
  try {
    const requestData = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: await request.text(),
      timestamp: Date.now()
    };
    
    // Store in IndexedDB for background sync
    const db = await openDB();
    const transaction = db.transaction(['failed_requests'], 'readwrite');
    const store = transaction.objectStore('failed_requests');
    await store.add(requestData);
    
    console.log('Service Worker: Stored failed request for background sync');
  } catch (error) {
    console.error('Service Worker: Failed to store request for background sync', error);
  }
}

// Open IndexedDB for storing failed requests
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BetTrackerDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('failed_requests')) {
        const store = db.createObjectStore('failed_requests', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(syncFailedRequests());
  }
});

// Sync failed requests when back online
async function syncFailedRequests() {
  try {
    const db = await openDB();
    const transaction = db.transaction(['failed_requests'], 'readonly');
    const store = transaction.objectStore('failed_requests');
    const requests = await store.getAll();
    
    console.log(`Service Worker: Syncing ${requests.length} failed requests`);
    
    for (const requestData of requests) {
      try {
        const response = await fetch(requestData.url, {
          method: requestData.method,
          headers: requestData.headers,
          body: requestData.body
        });
        
        if (response.ok) {
          // Remove successfully synced request
          const deleteTransaction = db.transaction(['failed_requests'], 'readwrite');
          const deleteStore = deleteTransaction.objectStore('failed_requests');
          await deleteStore.delete(requestData.id);
          
          console.log('Service Worker: Successfully synced request', requestData.url);
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync request', requestData.url, error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/view-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close-icon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('BetTracker Pro', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('Service Worker: Loaded');
