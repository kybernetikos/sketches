const CACHE_NAME = 'quantum-lottery-cache-v0.1'
const urlsToCache = [
    '../index.html',
    '../js/App.js',
    '../js/BallGroup.js',
    '../js/Lottery.js',
    '../js/lottery-logic.js',
    '../js/NumberOfTickets.js',
    '../js/Shortcuts.js',
    '../js/Ticket.js',
    '../js/utils.js',
    '../dependencies/preact-10.0.0-beta.1/hooks.module.js',
    '../dependencies/preact-10.0.0-beta.1/preact.module.js',
    '../icons/icon-192.png',
    '../style.css',
    '../favicon.ico'
]

self.addEventListener('install', (event) => {
    console.log('Service Worker: Installation: Attempting to cache static assets.');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.info('Service Worker: Caching', urlsToCache.join(", "))
                return cache.addAll(urlsToCache.map(toAbsolute));
            }).then(
            () => console.log("Service Worker: Caching complete.")
            ).catch((err) => {
                console.error('Service Worker: Cache failure', err)
            })
    )
})

self.addEventListener('fetch', event => {
    console.info('Service Worker: Fetch event for ', event.request.url)
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.info('Service Worker: Found ', event.request.url, ' in cache')
                    return response
                }
                console.info('Service Worker: Network request for ', event.request.url)
                return fetch(event.request)
            }).catch((err) => {
                console.error('Service Worker: fetch failure', err)
            })
    )
})

self.addEventListener('activate', event => {
    console.info('Service Worker: Activating.')

    // remove any caches that are no longer used.
    const cacheWhitelist = [CACHE_NAME]

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})

function toAbsolute(url) {
    return new URL(url, self.location).href
}