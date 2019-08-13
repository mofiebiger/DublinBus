var staticCacheName = "django-pwa-v" + new Date().getTime();
var filesToCache = [
'/offline',
'/static/css/style.css',
'/static/js/maps.js',
'/static/images/icons/android-chrome-192x192.png',
// '/static/images/icons/android-chrome-256x256.png',
// '/static/images/icons/apple-touch-icon-60x60.png',
// '/static/images/icons/apple-touch-icon-72x72.png',
// '/static/images/icons/apple-touch-icon-57x57.png',
// '/static/images/icons/apple-touch-icon-76x76.png',
'/static/images/icons/apple-touch-icon-114x114.png',
// '/static/images/icons/apple-touch-icon-120x120.png',
// '/static/images/icons/apple-touch-icon-144x144.png',
// '/static/images/icons/apple-touch-icon-152x152.png',
// '/static/images/icons/apple-touch-icon-180x180.png',
// '/static/images/icons/apple-touch-icon.png',
// '/static/images/icons/favicon-16x16.png',
// '/static/images/icons/favicon-32x32.png',
// '/static/images/icons/favicon.ico',
// '/static/images/icons/mstile-150x150.png',
// '/static/images/icons/safari-pinned-tab.svg',
// '/static/images/splash/android/android-launchericon-48-48.png',
// '/static/images/splash/android/android-launchericon-72-72.png',
// '/static/images/splash/android/android-launchericon-96-96.png',
// '/static/images/splash/android/android-launchericon-144-144.png',
// '/static/images/splash/android/android-launchericon-192-192.png',
// '/static/images/splash/android/android-launchericon-512-512.png',
// '/static/images/splash/chrome/chrome-extensionmanagementpage-48-48.png',
// '/static/images/splash/chrome/chrome-favicon-16-16.png',
// '/static/images/splash/chrome/chrome-installprocess-128-128.png',
// '/static/images/splash/firefox/firefox-general-16-16.png',
// '/static/images/splash/firefox/firefox-general-32-32.png',
// '/static/images/splash/firefox/firefox-general-48-48.png',
// '/static/images/splash/firefox/firefox-general-64-64.png',
// '/static/images/splash/firefox/firefox-general-90-90.png',
// '/static/images/splash/firefox/firefox-general-128-128.png',
// '/static/images/splash/firefox/firefox-general-256-256.png',
// '/static/images/splash/firefox/firefox-marketplace-128-128.png',
// '/static/images/splash/firefox/firefox-marketplace-512-512.png',
// '/static/images/splash/ios/ios-appicon-76-76.png',
// '/static/images/splash/ios/ios-appicon-120-120.png',
// '/static/images/splash/ios/ios-appicon-152-152.png',
// '/static/images/splash/ios/ios-appicon-180-180.png',
// '/static/images/splash/ios/ios-appicon-1024-1024.png',
// '/static/images/splash/ios/ios-launchimage-640-960.png',
// '/static/images/splash/ios/ios-launchimage-640-1136.png',
// '/static/images/splash/ios/ios-launchimage-750-1334.png',
// '/static/images/splash/ios/ios-launchimage-768-1024.png',
// '/static/images/splash/ios/ios-launchimage-1024-768.png',
// '/static/images/splash/ios/ios-launchimage-1242-2208.png',
// '/static/images/splash/ios/ios-launchimage-1334-750.png',
// '/static/images/splash/ios/ios-launchimage-1530-2048.png',
// '/static/images/splash/ios/ios-launchimage-2048-1536.png',
// '/static/images/splash/ios/ios-launchimage-2208-1242.png'

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
self.addEventListener('activate ', event => {
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
