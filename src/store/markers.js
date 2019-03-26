import $http from '../Services/http.service';
import cache from "@/Services/cache.service";
import axios from "axios";

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
		loading: false,
		borders: false,
		loadingCancelToken: null
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
			state.page = 0
			state.serverPage = 0;
			state.hasNext = false;
		},

		setUser(state, username) {
			state.username = username;
		},

		changePage(state, value) {
			if (state.page + value > -1 && state.page + value < (state.markers.length / pageSize)) {
				state.page += value;
			}
		},

		setBorders(state, borders) {
			state.borders = borders;
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
				if (state.borders) {
					route += `${startingId ? '&' : '?'}borders=` + JSON.stringify(state.borders);
				}

				if (state.loadingCancelToken) {
					state.loadingCancelToken.cancel();
				}
				state.loadingCancelToken = axios.CancelToken.source();
				const response = await $http.get(route, {
					cancelToken: state.loadingCancelToken.token
				});
				if (response === 'canceled') {
					return {
						response: 'canceled'
					};
				}
				if (response.status === 200 || response.status === 'cached') {
					const markers = response.data.markers;
					state.hasNext = response.data.pagination.hasNext;
					if (typeof response.data.pagination.page !== "undefined") {
						state.serverPage = response.data.pagination.page;
					}
					markers.forEach((item) => {
						commit('add', item)
					});
				}
				state.loading = false;
				state.loadingCancelToken = null;
				return response;
			} catch (error) {
				state.loading = false;
				state.loadingCancelToken = null;
				return error;
			}
		},

		async loadPrevious({commit, state}) {
			let response;
			try {
				state.loading = true;
				let route = `marker/${state.username}/${state.markers[0].id}/previous`;
				if (state.borders) {
					route += '?borders=' + JSON.stringify(state.borders);
				}

				response = await $http.get(route);
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
		},

		async toggleUserMarker({state}) {
			state.userMarker = !state.userMarker;
			await cache.store('settings', 'userMarker', state.userMarker);
		},
	}
}
