import $http from '../Services/http.service';

export default {
	namespaced: true,

	state: {
		user: {
			username: '',
			description: ''
		},
		open: false
	},
	mutations: {
		toggle(state) {
			state.open = !state.open;
		}
	},

	actions: {
		async load({state}, username) {
			if (username !== state.user.username) {
				state.user = {};
				const {data} = await $http.get(`bio/${username}`);
				state.user = {
					username,
					description: data.description,
					path: data.path
				};
			}
		}
	}

}