"use strict";

const CACHE_NAME = "v1";


// Event Listener - Install
self.addEventListener("install", (evt) => {
	console.log("Service Worker: Installed");
});


// Event Listener - Activate
self.addEventListener("activate", (evt) => {
	console.log("Service Worker: Activated");
	// Remove previous caches
	evt.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cache => {
					if (cache !== CACHE_NAME) {
						console.log('Service Worker: Clearing Old Cache');
						return caches.delete(cache);
					}
				})
			);
		})
	);
});


// Event Listener - Fetch
self.addEventListener("fetch", (evt) => {
	console.log("Service Worker: Fetching");
	evt.respondWith(
		fetch(evt.request)
			// Online
			.then(res => {
				// Make copy/clone of response
				const resClone = res.clone();
				// Open cahce
				caches.open(CACHE_NAME).then(cache => {
					// Add response to cache
					cache.put(evt.request, resClone);
				});
				return res;
			})
			// Offline
			.catch(err => caches.match(evt.request).then(res => res))
	);
});
