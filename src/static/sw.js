importScripts('/cache-polyfill.js')

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('alexanderalmstrom').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/app.css',
        '/site.css',
        '/vendors.js',
        '/app.js',
        '/site.js'
      ])
    })
  )
})

self.addEventListener('fetch', function(event) {
  console.log(event.request.url)
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request)
    })
  )
})
