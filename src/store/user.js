import $http from '../services/http.service';
import Auth from '../services/authentication.service';

export default {
	namespaced: true,
	mutations: {},
	actions: {
		logout() {
			Auth.logout();
		},
		async login({commit}, form) {
			let response = await $http.post('/auth/login', form);
			if (response.status === 200) {
				Auth.saveUser(response.data.user);
				return true;
			}
			return false;
		}
	}
}