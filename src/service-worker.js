import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { setCacheNameDetails } from 'workbox-core';
import { CacheFirst  } from 'workbox-strategies';

setCacheNameDetails({prefix: "captains-map"});

cleanupOutdatedCaches()

self.__precacheManifest = [].concat(self.__WB_MANIFEST || []);
precacheAndRoute(self.__precacheManifest, {});

registerRoute(
	new RegExp('/api/images/.*'),
	new CacheFirst({
		cacheName: 'image-cache',
	})
);

registerRoute(
	new RegExp('/api/thumbnails/.*'),
	new CacheFirst({
		cacheName: 'image-cache',
	})
);

self.addEventListener('message', (message) => {
	if (message.data.action === 'skipWaiting') {
		self.skipWaiting();
	}
});

self.addEventListener('push', (event) => {
	const payload = event.data.json();

	let image = payload.image;

	if (image.type !== 'image') {
		image = `https://map.elcoop.io/api/marker/instagram/${image.instagram_type}/${image.path}`;
	} else {
		image = `https://map.elcoop.io/api${image.path}`;
	}

	event.waitUntil(
		self.registration.showNotification(`${payload.username} posted a new marker`, {
			actions: [{
				action: 'see',
				title: 'See',
			}],
			icon: `https://map.elcoop.io/img/icons/icon-192x192.png`,
			badge: `https://map.elcoop.io/img/icons/icon-96x96.png`,
			image,
			data: payload.username
		})
	);
});

self.addEventListener('notificationclick', function (event) {
	const user = event.notification.data;

	event.notification.close();
	clients.openWindow(`https://map.elcoop.io/${user}`);
});

