/*!
  jQuery JSON WhatsApp InstaOrder
  Created by LivelyWorks - http://livelyworks.net
  @since ver. 1.1.0 - 05 MAR 2020
 - PWA - Service Worker
  Note: You may need to change the following things as per your need.
*/
// Installing service worker
const APP_NAME = 'lw-jquery-json-whatsapp-order';
/**
// Add relative URL of all the static content you want to store in
// cache storage (this will help us use our app offline)
*/
let resourcesToCache = ["default.htm",
    "pwa-example.html", // you may need to set to your page name if this different than pwa-example.html
    "data-provider/products.json", // your product json may be different
    "logo.svg", // your logo may be different
    'static-assets/ico/favicon-32x32.png ',
    'static-assets/ico/android-chrome-192x192.png',
    'static-assets/ico/android-chrome-512x512.png',
    'pwa.manifest',
    'static-assets/lw-jquery-whatsapp-insta-order/css/lw-jquery-whatsapp-insta-order.css',
    'static-assets/lw-jquery-whatsapp-insta-order/js/lw-jquery-whatsapp-insta-order.js',
    'static-assets/lw-jquery-whatsapp-insta-order/img/ajax-loader.gif',
    'static-assets/lw-jquery-whatsapp-insta-order/img/broken.png',
    'static-assets/lw-jquery-whatsapp-insta-order/img/image-broken.png',
    'static-assets/packages/fontawesome-free-5.11.2-web/css/all.min.css',
    'static-assets/packages/fontawesome-free-5.11.2-web/webfonts/fa-solid-900.woff2',
    'static-assets/packages/fontawesome-free-5.11.2-web/webfonts/fa-solid-900.woff',
    'static-assets/packages/fontawesome-free-5.11.2-web/webfonts/fa-solid-900.ttf',
    'static-assets/packages/fontawesome-free-5.11.2-web/webfonts/fa-brands-400.woff2',
    'static-assets/packages/fontawesome-free-5.11.2-web/webfonts/fa-brands-400.woff',
    'static-assets/packages/bootstrap-4.6.0/css/bootstrap.min.css',
    'static-assets/packages/other-js-libs/underscore-min.js',
    'static-assets/packages/bootstrap-4.6.0/js/bootstrap.bundle.min.js',
    'static-assets/packages/other-js-libs/jquery-3.4.1.min.js',
    'static-assets/packages/other-js-libs/jquery.validate.min.js',
    'static-assets/packages/other-js-libs/jquery.json.min.js',
    'static-assets/packages/other-js-libs/jstorage.min.js',
    'static-assets/packages/other-js-libs/jquery.lazy.min.js',
    'static-assets/packages/other-js-libs/masonry.pkgd.min.js',
];

self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(APP_NAME).then(cache => {
            return cache.addAll(resourcesToCache);
        })
    );
});

// Cache and return requests
self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
});

// Update a service worker
const cacheWhitelist = [APP_NAME];
self.addEventListener('activate', event => {
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