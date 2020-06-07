import $http from '../Services/HttpService';

export default {
	namespaced: true,

	state: {
		story: null,
		markers: [],
		loading: false,
	},

	mutations: {
		exit(state) {
			state.story = null;
			state.markers = [];
		},

		add(state, marker) {
			state.markers.push(marker);
			if (state.markers.length === 1) {
				state.story.cover = {
					type: marker.media[0].type,
					path: marker.media[0].path,
				};
			}
		},

		remove(state, id) {
			state.markers = state.markers.filter((marker) => {
				return marker.id !== id;
			});
			if (state.markers.length > 0) {
				state.story.cover = {
					type: state.markers[0].media[0].type,
					path: state.markers[0].media[0].path,
				};
			} else {
				state.story.cover = {
					type: null,
					path: null
				};
			}
		},
	},

	actions: {
		async load({state}, {user, storyId}) {
			state.loading = true;
			const response = await $http.get(`story/${user}/${storyId}`);
			state.loading = false;
			if (response.status === 404) {
				return 404;
			}
			const story = response.data;
			state.story = {
				id: storyId,
				name: story.name,
				user_id: story.user_id,
				published: story.published,
				cover: story.cover
			};

			state.markers = story.markers;
			return response.status;
		},

		async save({state, commit}, {name, published}) {
			let url = 'story';
			let method = 'post';

			if (state.story) {
				method = 'patch';
				url += `/${state.story.id}`;
			}

			const response = await $http[method](url, {
				name,
				published: published || 0
			});

			if (response.status === 201) {
				const story = response.data;
				commit('Profile/addStory', story, {
					root: true
				});
			} else if (response.status === 200) {
				state.story.name = name;
				state.story.published = published;
				commit('Profile/updateStory', {
					id: state.story.id,
					name,
					published
				}, {
					root: true
				});
			}

			return {
				status: response.status,
				id: response.data.id || 0
			};
		},

		async delete({state, commit}) {
			const response = await $http.delete(`story/${state.story.id}`);

			if (response.status !== 200) {
				return false;
			}

			commit('Profile/removeStory', state.story.id, {
				root: true
			});

			return true;
		}
	}

}
