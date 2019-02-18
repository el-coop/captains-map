import $http from '../Services/http.service';
import Auth from '../Services/authentication.service';
import router from '@/router';

export default {
	namespaced: true,
	mutations: {},
	actions: {
		async logout() {
			await Auth.logout();
			router.go('/');
		},
		async login({commit}, form) {
			let response = await $http.post('auth/login', form);
			if (response.status === 200) {
				Auth.saveUser(response.data.user);
				return true;
			}
			return false;
		}
	}
}
