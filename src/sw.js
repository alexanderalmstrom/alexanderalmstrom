importScripts('/cache-polyfill.js')

// Replaced with the built asset list by the service-worker plugin in
// vite.config.mts.
const precache = __PRECACHE__

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('alexanderalmstrom').then(function (cache) {
      return cache.addAll(precache)
    }),
  )
})

self.addEventListener('fetch', function (event) {
  console.log(event.request.url)
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request)
    }),
  )
})
