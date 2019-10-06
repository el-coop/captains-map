import $http from '../Services/HttpService';
import Auth from '../Services/AuthenticationService';
import router from '@/router';

export default {
	namespaced: true,
	mutations: {},
	actions: {
		async logout() {
			await $http.get('auth/logout');
			await Auth.logout();
			router.push('/');
		},
		async login({commit}, form) {
			const response = await $http.post('auth/login', form);
			if (response.status === 200) {
				Auth.saveUser(response.data.user);
				return true;
			}
			return false;
		},

		extend({commit}, duration) {
			Auth.extend(duration);
		}
	}
}
