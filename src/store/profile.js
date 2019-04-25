import $http from '../Services/http.service';

export default {
	namespaced: true,

	state: {
		user: {
			username: '',
			description: '',
			path: null
		},
		open: false
	},
	mutations: {
		toggle(state) {
			state.open = !state.open;
		},
		updateBio(state, user) {
			state.user = user;
		}
	},

	actions: {
		async load({commit, state}, username) {
			if (username !== state.user.username) {
				commit('updateBio', {});
				const {data} = await $http.get(`bio/${username}`);
				commit('updateBio', {
					username,
					description: data.description,
					path: data.path
				});
			}
		}
	}

}
