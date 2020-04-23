import HttpService from "@/Services/HttpService";

async function subscribe(registration) {
	try {
		const response = await HttpService.get('follow/key');
		if (response.status !== 200) {
			return false;
		}
		const vapidKey = urlBase64ToUint8Array(response.data.key);
		return await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: vapidKey
		});
	} catch (e) {
		return false;
	}
}

function urlBase64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

export default {
	namespaced: true,
	state: {
		following: [],
		hasPush: false,
		registration: null,
		subscription: null
	},
	actions: {
		async initialize({state}, value) {
			state.hasPush = 'serviceWorker' in navigator && 'PushManager' in window;
			if (!state.hasPush) {
				return;
			}
			state.registration = value;
			state.subscription = await state.registration.pushManager.getSubscription();

			if (state.subscription) {
				const response = await HttpService.get(`follow?endpoint=${state.subscription.endpoint}`);
				if (response.status > 199 && response.status < 300) {
					state.following = response.data;
				}
			}
		},

		async toggleFollow({state}, username) {
			if (!state.subscription) {
				state.subscription = await subscribe(state.registration);
				if (!state.subscription) {
					return false;
				}
			}

			const response = await HttpService.post(`follow/toggleFollow/${username}`, {
				subscription: state.subscription
			});

			if (response.status < 200 || response.status > 299) {
				return false;
			}

			if (response.status === 201) {
				state.following.push(username);
			} else {
				const index = state.following.indexOf(username);
				if (index !== -1) {
					state.following.splice(index, 1);
				}
			}
			return true;
		}
	}
}
