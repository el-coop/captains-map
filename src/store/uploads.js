import cache from '@/Services/cache.service';
import auth from '@/Services/authentication.service';
import UploadService from '@/Services/UploadService';
import ImageService from '@/Services/ImageService';

const uploads = cache.caches().uploads;

export default {
	namespaced: true,

	state: {
		queue: [],
		errored: [],
		workingId: null,
		loaded: false
	},

	getters: {
		allFiles(state) {
			return state.queue.concat(state.errored);

		}
	},

	mutations: {

		pushToQueue(state, data) {
			state.queue.push(data);
		},

		pushToErrored(state, data) {
			state.errored.push(data);
		},

		removeFromQueue(state, key) {
			const index = state.queue.findIndex((item) => {
				return item.uploadTime === key;
			});
			state.queue.splice(index, 1);
		},

		removeFromErrored(state, key) {
			const index = state.errored.findIndex((item) => {
				return item.uploadTime === key;
			});
			state.errored.splice(index, 1);
		},

		markAsWorking(state, id) {
			state.workingId = id;
		}

	},

	actions: {
		processQueue({state, rootState}) {
			if (state.loaded && rootState.hasCsrf) {
				UploadService.processQueue();
			}
		},

		async init({state, dispatch}) {
			await uploads.iterate((data) => {
				data = data.value;
				if (data.error) {
					state.errored.push(data);
				} else {
					state.queue.push(data);
				}
			});
			state.loaded = true;
			dispatch('processQueue');
		},

		async upload({commit}, data) {
			if (data['media[type]'] === 'image' && data['media[image]']) {
				data['media[image]'] = await ImageService.imageToBlob(data['media[image]']);
			}

			data.uploadTime = Date.now();
			await cache.store('uploads', data.uploadTime, data);
			commit("pushToQueue", data);
			UploadService.processQueue();
		},

		async cancelUpload({commit}, uploadTime) {
			await cache.forget('uploads', uploadTime);
			commit("removeFromErrored", uploadTime);

		},

		async returnToQueue({state, commit, rootState}, data) {
			if (data['media[type]'] === 'image') {
				if (data['media[image]'] && data['media[image]'].size) {
					data['media[image]'] = await ImageService.imageToBlob(data['media[image]']);
				} else {
					const oldData = state.errored.find((marker) => {
						return marker.uploadTime === data.uploadTime;
					});
					data['media[image]'] = oldData['media[image]'];
				}
			}
			data.error = null;
			commit("removeFromErrored", data.uploadTime);
			commit("pushToQueue", data);

			if (rootState.hasCsrf) {
				UploadService.processQueue();
			}

		},

		async uploadError({commit}, marker) {
			this._vm.$toast.error('Please try again later', 'Upload failed');
			commit('removeFromQueue', marker.uploadTime);
			commit('pushToErrored', marker);
			await cache.store('uploads', marker.uploadTime, marker);
		},

		async uploaded({commit}, data) {
			await cache.forget('uploads', data.uploadTime);

			commit('removeFromQueue', data.uploadTime);
			commit('Markers/addAtStart', data, {
				root: true
			});
		},

		async purge({state}) {
			await cache.clear('uploads');

			state.queue = [];
			state.errored = [];
			state.workingId = null;
		},

		uploadOfflineError({dispatch, state}) {
			if (auth.isLoggedIn()) {
				const offlines = state.errored.filter((marker) => {
					return marker.error.status === 'offline';
				});
				offlines.forEach((marker) => {
					const returningMarker = JSON.parse(JSON.stringify(marker));
					delete returningMarker['media[image]'];
					dispatch('returnToQueue', returningMarker);
				});
			}
		}
	},
}
