import $http from '../services/http.service';

export default {
	namespaced: true,

	state: {
		markers: [],
		userMarker: false
	},
	mutations: {
		add(state, marker) {
			state.markers.unshift(marker);
		},

		remove(state, id) {
			state.markers = state.markers.filter((marker) => {
				return marker.id !== id;
			});
		},

		clear(state) {
			state.markers = [];
		},

		toggleUserMarker(state) {
			state.userMarker = !state.userMarker;
		}

	},
	actions: {
		async load({commit}, username = '') {
			try {
				commit('clear');
				const response = await $http.get(`marker/${username}`);
				if (response.status === 200 || response.status === 'cached') {
					response.data.forEach((item) => {
						commit('add', item)
					});
				}
				return response;
			} catch (error) {
				return error;
			}
		},

		async delete({commit}, id) {
			let response = await $http.delete(`marker/${id}`);
			if (response) {
				commit('remove', id);
				return true;
			}
			return false
		}
	}
}