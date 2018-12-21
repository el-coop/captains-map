import $http from '../Services/http.service';

export default {
	namespaced: true,

	state: {
		user: {
			username: 'nur',
			bio: 'lorem ipsum'
		},
		open: false
	},
	mutations: {
		toggle(state) {
			state.open = !state.open;
		}
	},
}