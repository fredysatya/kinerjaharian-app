self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('kpu-store').then((cache) => cache.addAll([
      'index.html',
      'manifest.json',
      // Masukkan nama file icon jika sudah upload
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
