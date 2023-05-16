/* eslint-disable no-console */

import {register} from 'register-service-worker'
import toast from 'izitoast';
import store from "@/store";

if (import.meta.env.PROD) {
	register(`${import.meta.env.VITE_APP_BASE_URL}service-worker.js`, {
		ready(registration) {
			console.log(
				'App is being served from cache by a service worker.\n' +
				'For more details, visit https://goo.gl/AFskqB'
			);
			store.dispatch('Webpush/initialize', registration);
		},
		cached() {
			console.log('Content has been cached for offline use.');
		},
		updated(registration) {
			console.log('New content is available; please refresh.');
			toast.question({
				title: "Update available for Captain's Map.",
				message: '',
				timeout: 10000,
				icon: '',
				position: 'bottomCenter',
				buttons: [
					['<button>Update</button>', () => {
						try {
							registration.waiting.postMessage({action: 'skipWaiting'});
						} catch (error) {
						}
					}],
				]
			});
		},
		offline() {
			console.log('No internet connection found. App is running in offline mode.');
		},
		error(error) {
			console.error('Error during service worker registration:', error);
		}
	});

	let refreshing;
	navigator.serviceWorker.addEventListener("controllerchange", () => {
		if (refreshing) return;
		window.location.reload();
		refreshing = true;
	});
} else {
	navigator.serviceWorker.register('/dist/service-worker.js')
		.then((registration) => {
			console.log('serviceWorker installed!');
			store.dispatch('Webpush/initialize', registration);
		})
		.catch((err) => {
			console.log(err)
		});
}
