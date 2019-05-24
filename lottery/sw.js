const CACHE_NAME = 'quantum-lottery-cache-v0';
const urlsToCache = [
    '/lottery/index.html',
    '/lottery/App.js',
    '/lottery/BallGroup.js',
    '/lottery/Lottery.js',
    '/lottery/lottery-logic.js',
    '/lottery/NumberOfTickets.js',
    '/lottery/Shortcuts.js',
    '/lottery/Ticket.js',
    '/lottery/utils.js',
    '/lottery/preact-10.0.0-beta.1/hooks.module.js',
    '/lottery/preact-10.0.0-beta.1/preact.module.js',
    '/lottery/icons/icon-192.png',
    '/lottery/style.css',
    '/lottery/favicon.ico'
];

self.addEventListener('install', (event) => {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('Found ', event.request.url, ' in cache');
                    return response;
                }
                console.log('Network request for ', event.request.url);
                return fetch(event.request)
            })
    );
});

self.addEventListener('activate', event => {
    console.log('Activating new service worker...');

    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
