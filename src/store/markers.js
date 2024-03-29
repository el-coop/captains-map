import $http from '../Services/HttpService';
import cache from "@/Services/Cache";
import axios from "axios";

const pageSize = parseInt(import.meta.env.VITE_APP_PAGE_SIZE);

function calculateRoute({username, borders}, settings) {
	let route = `marker/${username}`;
	if (settings.startingId) {
		if (settings.pageIncluding) {
			route += `/${settings.startingId}`;
		} else {
			route += `?startingId=${settings.startingId}`;
		}
	}
	if (borders) {
		route += `${settings.startingId ? '&' : '?'}borders=` + JSON.stringify(borders);
	}
	return route;
}

function addMarkers(response, state, commit) {
	state.hasNext = response.data.pagination.hasNext;
	if (typeof response.data.pagination.page !== "undefined") {
		state.serverPage = response.data.pagination.page;
	}
	response.data.markers.forEach((item) => {
		commit('add', item)
	});
}

function calculateSettings(payload) {
	const settings = {
		startingId: false,
		pageIncluding: false
	};

	if (!isNaN(payload)) {
		settings.startingId = payload
	} else {
		Object.assign(settings, payload);
	}
	return settings;
}

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
			state.page = 0;
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
		},

		updateProfilePic(state, {username, path}) {
			state.markers.forEach((marker) => {
				if (marker.user.username === username) {
					marker.user.bio.path = path;
				}
			});
		}

	},
	actions: {
		async load({commit, state}, payload = {}) {
			const settings = calculateSettings(payload);
			let response;
			try {
				state.loading = true;
				if (!settings.startingId) {
					commit('clear');
				}
				const route = calculateRoute(state, settings);

				if (state.loadingCancelToken) {
					state.loadingCancelToken.cancel();
				}
				state.loadingCancelToken = axios.CancelToken.source();
				response = await $http.get(route, {
					cancelToken: state.loadingCancelToken.token
				});
				if (response === 'canceled') {
					return {
						response
					};
				}
				if (response.status === 200 || response.status === 'cached') {
					addMarkers(response, state, commit);
				}
			} catch (error) {
				response = error;
			}

			state.loading = false;
			state.loadingCancelToken = null;
			return response;
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

		async delete({commit}, {id, story}) {
			let response = await $http.delete(`marker/${id}`);
			if (response) {
				if (story) {
					commit('Stories/remove', id, {
						root: true
					});
				} else {
					commit('remove', id);
				}
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
