import $http from '../Services/HttpService';
import router from '@/router';
import cache from "@/Services/Cache";

export default {
	namespaced: true,
	state: {
		user: null,
		initialized: false
	},
	mutations: {},
	actions: {
		async init({state}) {
			state.user = await cache.get('settings', 'user');
			state.initialized = true;
		},

		async isLoggedIn({state, dispatch}) {
			if(! state.initialized){
				await dispatch('init');
			}
			if (state.user) {
				if (parseInt(state.user.exp) > Date.now()) {
					return true;
				}
				dispatch('logout');
				return false;
			} else {
				return false;
			}
		},


		async logout({dispatch, state}) {
			await $http.get('auth/logout');
			await dispatch('Uploads/purge', {}, {root: true});
			await cache.forget('settings', 'user');
			await cache.clear('requests');
			state.user = null;
			if (router.currentRoute.path !== '/') {
				await router.push('/');
			}
		},

		async login({state}, form) {
			const response = await $http.post('auth/login', form);
			if (response.status === 200) {
				const user = response.data.user;
				state.user = user;
				await cache.store('settings', 'user', {
					id: user.id,
					username: user.username,
					exp: user.exp,
				}, user.exp - Date.now());
				return true;
			}
			return false;
		},

		async extend({state}, duration) {
			state.user.exp = duration;
			await cache.store('settings', 'user', {
				id: state.user.id,
				username: state.user.username,
				exp: duration,
			}, duration);
		}
	}
}
