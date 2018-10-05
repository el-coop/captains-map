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
		serverPage: 0,
		loading: false
	},
	mutations: {
		add(state, marker) {
			state.markers.push(marker);
		},

		addAtStart(state, marker) {
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
		},

		setUser(state, username) {
			state.username = username;
		},

		changePage(state, value) {
			if (state.page + value > -1 && state.page + value < (state.markers.length / pageSize)){
				state.page += value;
			}
		}

	},
	actions: {
		async load({commit, state}, payload = false) {
			let startingId = false;
			let pageIncluding = false;
			if (payload) {
				if (!isNaN(payload)) {
					startingId = payload
				} else {
					startingId = payload.startingId || false;
					pageIncluding = payload.pageIncluding || false;
				}
			}
			try {
				state.loading = true;
				if (!startingId) {
					commit('clear');
				}
				let route = `marker/${state.username}`;
				if (startingId) {
					if (pageIncluding) {
						route += `/${startingId}`;
					} else {
						route += `?startingId=${startingId}`;
					}
				}

				const response = await $http.get(route);
				if (response.status === 200 || response.status === 'cached') {
					const markers = response.data.markers;
					state.hasNext = response.data.pagination.hasNext;
					if (typeof response.data.pagination.page !== undefined) {
						state.serverPage = response.data.pagination.page;
					}
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

		async loadPrevious({commit, state}) {
			let response;
			try {
				state.loading = true;

				response = await $http.get(`marker/${state.username}/${state.markers[0].id}/previous`);
				if (response.status === 200 || response.status === 'cached') {
					const markers = response.data.markers;
					markers.forEach((item) => {
						commit('addAtStart', item)
					});
				}
			} catch (error) {
				response = error;
			}
			state.loading = false;
			return response;
		},

		async delete({commit}, id) {
			let response = await $http.delete(`marker/${id}`);
			if (response) {
				commit('remove', id);
				return true;
			}
			return false
		},

		async previousPage({commit, state, dispatch}) {
			if (state.page > 0) {
				return commit('changePage', -1);
			}
			if (state.serverPage > 0) {
				state.serverPage--;
				return await dispatch('loadPrevious');
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