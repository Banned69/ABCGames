'use strict';

const cacheName = 'fullSite'

self.addEventListener('install', e => {
    console.log('Service Worker Installed');
});

self.addEventListener('activate', e => {
    console.log('Service Worker Activated');
    e.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cache => {
                if (cache !== cacheName) {
                    console.log('Clearing Old Cache');
                    return caches.delete(cache);
                }
            })
        );
    }));
});

self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request)
        .then(res => {
            caches
            .open(cacheName)
            .then(cache => {
                cache.put(e.request, res.clone());
                console.log('Site Cached')
            });
            return res;
        }).catch(err => caches.match(e.request).then(res => res))
    );
});
