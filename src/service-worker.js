workbox.core.setCacheNameDetails({prefix: "captains-map"});

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});


workbox.routing.registerRoute(
	new RegExp('/img/'),
	workbox.strategies.cacheFirst({
		cacheName: 'image-cache',
	})
);