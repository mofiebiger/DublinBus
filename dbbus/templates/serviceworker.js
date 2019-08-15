var staticCacheName = "django-pwa-v" + new Date().getTime();
var filesToCache = [
'/offline',
'/static/css/style.css',
'/static/js/maps.js',
'/static/images/android-chrome-192x192.png',
'/static/images/apple-touch-icon-114x114.png',
'/static/images/android-launchericon-512-512.png',
];

// Cache on install
self.addEventListener("install", event => {
this.skipWaiting();
event.waitUntil(
caches.open(staticCacheName)
.then(cache => {
return cache.addAll(filesToCache);
})
)
});

// Clear cache on activate
self.addEventListener('activate', event => {
event.waitUntil(
caches.keys().then(cacheNames => {
return Promise.all(
cacheNames
.filter(cacheName => (cacheName.startsWith("django-pwa-")))
.filter(cacheName => (cacheName !== staticCacheName))
.map(cacheName => caches.delete(cacheName))
);
})
);
});

// Serve from Cache
self.addEventListener("fetch", event => {
event.respondWith(
caches.match(event.request)
.then(response => {
return response || fetch(event.request);
})
.catch(() => {
return caches.match('offline');
})
)
});
