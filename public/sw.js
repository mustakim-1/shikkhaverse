const CACHE_NAME = 'sv-cache-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE_NAME);
    const m = await c.match(r);
    if (m) return m;
    try {
      const f = await fetch(r);
      if (f && f.status === 200 && r.url.startsWith(self.location.origin)) {
        c.put(r, f.clone());
      }
      return f;
    } catch {
      const home = await c.match('/');
      return home || new Response('', { status: 503 });
    }
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil((async () => {
    const cs = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (cs.length > 0) {
      cs[0].focus();
    } else {
      clients.openWindow('/');
    }
  })());
});
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'BRIGHT BD';
  const body = data.body || '';
  e.waitUntil(self.registration.showNotification(title, { body }));
});
