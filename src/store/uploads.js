import cache from '@/Services/Cache';
import Store from '@/store';
import UploadService from '@/Services/UploadService';
import UploadFile from "@/Classes/UploadFile";

const uploads = cache.caches().uploads;

export default {
	namespaced: true,

	state: {
		queue: [],
		errored: [],
		workingId: null,
		loaded: false,
		progress: null
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
		},

		setProgress(state, progress) {
			state.progress = progress;
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
				data = data.value
				for (let prop in data.media.files) {
					const file = data.media.files[prop];
					data.media.files[prop] = new UploadFile(file.name, file.image);
				}
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
			data.uploadTime = Date.now();
			commit("pushToQueue", data);
			await cache.store('uploads', data.uploadTime, data);
			UploadService.processQueue();
		},

		async cancelUpload({commit}, uploadTime) {
			await cache.forget('uploads', uploadTime);
			commit("removeFromErrored", uploadTime);

		},

		async returnToQueue({state, commit, rootState}, data) {
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

		async uploadOfflineError({dispatch, state}) {
			const isLoggedIn = await auth.isLoggedIn();
			if (isLoggedIn) {
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
