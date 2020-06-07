import $http from '../Services/HttpService';

export default {
	namespaced: true,

	state: {
		user: {
			username: '',
			description: '',
			path: null,
		},
		stories: [],
		open: false
	},
	mutations: {
		toggle(state) {
			state.open = !state.open;
		},
		updateBio(state, user) {
			state.user = user;
		},
		setStories(state, stories) {
			state.stories = stories;
		},
		updateStory(state, {id, name, published}) {
			if (!state.stories.length) {
				return;
			}
			const story = state.stories.find((story) => {
				return story.id == id;
			});

			story.name = name;
		},
		addStory(state, story) {
			state.stories.unshift(story);
		},
		removeStory(state, storyId) {
			if (!state.stories.length) {
				return;
			}
			const key = state.stories.findIndex((story) => {
				return story.id == storyId;
			});
			state.stories.splice(key, 1);
		},
		close(state) {
			state.open = false;
		},

		trackStory(state, updatedStory) {
			const key = state.stories.findIndex((story) => {
				return story.id == updatedStory.id;
			});

			if (key > -1) {
				state.stories[key].cover = updatedStory.cover;
			}
		}
	},

	actions: {
		purge({commit}){
			commit('updateBio', {});
			commit('setStories', []);
		},

		async load({commit, state}, username) {
			if (username !== state.user.username) {
				commit('updateBio', {});
				commit('setStories', []);
				const {data} = await $http.get(`bio/${username}`);
				commit('updateBio', {
					username,
					description: data.description,
					path: data.path
				});
				commit('setStories', data.stories);
			}
		}
	}

}
