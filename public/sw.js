
const CACHE_NAME = 'anrielly-gomes-v1.0.0';
const urlsToCache = [
  '/',
  '/manifest.json'
];

// Helper function to check if URL is cacheable
const isCacheableRequest = (request) => {
  const url = new URL(request.url);
  
  // Filter out unsupported schemes
  if (!['http:', 'https:'].includes(url.protocol)) {
    return false;
  }
  
  // Filter out extension URLs
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
    return false;
  }
  
  // Filter out external analytics and tracking
  if (url.hostname.includes('cloudflareinsights.com') || 
      url.hostname.includes('google-analytics.com') ||
      url.hostname.includes('googletagmanager.com')) {
    return false;
  }
  
  return true;
};

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened, adding URLs...');
        // Only cache essential files that exist
        return cache.addAll(urlsToCache.filter(url => {
          // Only cache basic paths that we know exist
          return url === '/' || url === '/manifest.json';
        }));
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
        // Don't fail installation if cache fails
        return Promise.resolve();
      })
  );
  self.skipWaiting();
});

// Fetch event with improved error handling
self.addEventListener('fetch', (event) => {
  // Skip non-cacheable requests
  if (!isCacheableRequest(event.request)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        return fetch(event.request.clone()).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response for caching
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              // Only cache if request is still cacheable
              if (isCacheableRequest(event.request)) {
                cache.put(event.request, responseToCache);
              }
            })
            .catch((error) => {
              console.warn('Failed to cache response:', error);
            });

          return response;
        }).catch((error) => {
          console.warn('Fetch failed:', error);
          
          // Return a fallback page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
          
          // For other requests, just let them fail gracefully
          return new Response('', { status: 408, statusText: 'Request timeout' });
        });
      })
      .catch((error) => {
        console.error('Cache match failed:', error);
        return fetch(event.request).catch(() => {
          return new Response('', { status: 503, statusText: 'Service unavailable' });
        });
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Push notification event (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body,
        icon: '/LogoAG_192x192.png',
        badge: '/LogoAG_192x192.png',
        data: data.url
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    } catch (error) {
      console.error('Push notification error:', error);
    }
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});

// Error event listener
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

// Unhandled rejection listener
self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
  event.preventDefault();
});
