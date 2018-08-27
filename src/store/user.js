import $http from '../services/http.service';
import Auth from '../services/authentication.service';
import router from '@/router';

export default {
	namespaced: true,
	mutations: {},
	actions: {
		logout() {
			Auth.logout();
			router.push('/');
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