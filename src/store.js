import Vue from 'vue';
import Vuex from 'vuex';
import User from '@/store/user';
import Markers from '@/store/markers';
import Profile from '@/store/profile';
import Uploads from '@/store/uploads';
import cache from "@/Services/Cache";
import router from './router'

Vue.use(Vuex);

export const actions = {
	CSRFReady({dispatch, state}) {
		if (!state.hasCsrf) {
			state.hasCsrf = true;
			dispatch('Uploads/processQueue');
		}
	},

	async initSettings({dispatch}) {
		if (await cache.get('settings', 'userMarker', false)) {
			dispatch('Markers/toggleUserMarker');
		}
		const route = await cache.get('settings', 'route', false);
		if (route && router.currentRoute.fullPath === '/' && route !== router.currentRoute.fullPath) {
			router.push(route);
		}
	},
};

const store = new Vuex.Store({
	modules: {
		User,
		Markers,
		Profile,
		Uploads
	},
	state: {
		hasCsrf: false
	},
	actions
});

export default store;
