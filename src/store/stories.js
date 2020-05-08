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
		},
	},

	actions: {
		async load({state}, storyId) {
			state.loading = true;
			const response = await $http.get(`story/${storyId}`);
			state.loading = false;
			const story = response.data;
			state.story = {
				id: storyId,
				name: story.name,
				user_id: story.user_id,
				published: story.published
			};

			state.markers = story.markers;
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
			}

			return {
				status: response.status,
				id: response.data.id
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
