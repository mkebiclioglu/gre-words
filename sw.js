// Network first so new words show up right away; fall back to the cache when offline.
const CACHE = 'gre-words-v1';
const CORE = ['./', 'GRE%20Vocab%20Prep.txt', 'manifest.webmanifest', 'icon-192.png'];

self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE))) });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)) }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
