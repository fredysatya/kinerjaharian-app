const STATIC_CACHE = 'kpu-static-v4';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// INSTALL
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== STATIC_CACHE && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Jangan cache Google Apps Script
  if (url.origin.includes('script.google.com')) {
    return e.respondWith(fetch(e.request));
  }

  // HTML → network first
  if (e.request.mode === 'navigate') {
    return e.respondWith(
      fetch(e.request).catch(() => caches.match('/index.html'))
    );
  }

  // Asset → cache first
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
