const STATIC_CACHE = 'kpu-static-v5'; // Naikkan versi ke v5

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// INSTALL: Simpan asset statis (Logo, Manifest, UI Dasar)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATE: Hapus cache lama agar aplikasi selalu segar
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => {
        if (k !== STATIC_CACHE) return caches.delete(k);
      }))
    )
  );
  self.clients.claim();
});

// FETCH: Logika pengambilan data
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // STRATEGI: Bypass/Abaikan semua yang berhubungan dengan Google
  // Kita tambahkan googleusercontent.com karena GAS sering redirect ke sana
  if (url.origin.includes('script.google.com') || url.origin.includes('googleusercontent.com')) {
    return; // Biarkan browser menangani langsung tanpa campur tangan Service Worker
  }

  // HTML: Network First, Fallback ke Cache
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // ASSETS (Icon/CSS): Cache First
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
