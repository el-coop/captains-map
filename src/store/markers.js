import $http from '../services/http.service';

const pageSize = parseInt(process.env.VUE_APP_PAGE_SIZE);

export default {
	namespaced: true,

	state: {
		markers: [],
		userMarker: false,
		hasNext: false,
		username: '',
		page: 0,
		loading: false
	},
	mutations: {
		add(state, marker) {
			state.markers.push(marker);
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
		},

		setUser(state, username) {
			state.username = username;
		},

		changePage(state, value) {
			state.page += value;
		}

	},
	actions: {
		async load({commit, state}, startingId = false) {
			try {
				state.loading = true;
				if(! startingId){
					commit('clear');
				}
				const response = await $http.get(`marker/${state.username}${ startingId ? `?startingId=${startingId}` : ''}`);
				if (response.status === 200 || response.status === 'cached') {
					const markers = response.data.markers;
					state.hasNext = response.data.pagination.hasNext;
					markers.forEach((item) => {
						commit('add', item)
					});
				}
				state.loading = false;
				return response;
			} catch (error) {
				state.loading = false;
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
		},

		previousPage({commit, state}) {
			if (state.page > 0) {
				commit('changePage', -1);
			}
		},

		async nextPage({commit, state, dispatch}) {
			if (state.markers.length > state.page * pageSize + pageSize) {
				return commit('changePage', +1);
			}
			if (state.hasNext) {
				await dispatch('load', state.markers[state.markers.length - 1].id);
				return commit('changePage', +1);
			}
		}
	}
}