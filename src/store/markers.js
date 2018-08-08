import $http from '../services/http.service';

export default {
	namespaced: true,

	state: {
		markers: [],
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
		}

	},
	actions: {
		async load({commit}, username = '') {
			try {
				commit('clear');
				const markersRequest = await $http.get(`marker/${username}`);
				if (markersRequest.data !== undefined) {
					markersRequest.data.forEach((item) => {
						commit('add', item)
					});
					if (markersRequest.data.length) {
						return markersRequest.data;
					}
				}

				return false;
			} catch (error) {
				return false;
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