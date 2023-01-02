import { createStore } from 'vuex'
import User from '@/store/user';
import Markers from '@/store/markers';
import Profile from '@/store/profile';
import Uploads from '@/store/uploads';
import Stories from '@/store/stories';
import Webpush from '@/store/Webpush';
import cache from "@/Services/Cache";
import router from './router'

export const actions = {
	CSRFReady({dispatch, state}) {
		if (!state.hasCsrf) {
			state.hasCsrf = true;
			dispatch('Uploads/processQueue');
		}
	},

	async initSettings({dispatch}) {
		dispatch('User/init');

		if (await cache.get('settings', 'userMarker', false)) {
			dispatch('Markers/toggleUserMarker');
		}
		const route = await cache.get('settings', 'route', false);
		if (route && router.currentRoute.fullPath === '/' && route !== router.currentRoute.fullPath) {
			router.push(route);
		}
	},
};

const store = createStore({
	modules: {
		User,
		Stories,
		Markers,
		Profile,
		Uploads,
		Webpush
	},
	state: {
		hasCsrf: false
	},
	actions
});

export default store;
