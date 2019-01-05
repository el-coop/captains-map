workbox.core.setCacheNameDetails({prefix: "captains-map"});

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});


workbox.routing.registerRoute(
	new RegExp('/api/images/.*'),
	workbox.strategies.cacheFirst({
		cacheName: 'image-cache',
	})
);

workbox.routing.registerRoute(
	new RegExp('/api/thumbnails/.*'),
	workbox.strategies.cacheFirst({
		cacheName: 'image-cache',
	})
);

self.addEventListener('message',(message) => {
	if(message.data.action === 'skipWaiting'){
		self.skipWaiting();
	}
});
