import cache from '@/Services/cache.service';
import UploadService from '@/Services/UploadService';

const uploads = cache.caches().uploads;

const imageToBlob = function (image) {
	if (typeof FileReader === "undefined") {
		return image
	}
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener('abort', (error) => {
			reject(error);
		});
		reader.addEventListener('error', (error) => {
			reject(error);
		});
		reader.addEventListener('loadend', (event) => {
			resolve(reader.result);
		});
		reader.readAsBinaryString(image);
	});
};

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
				data['media[image]'] = await imageToBlob(data['media[image]']);
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

		async returnToQueue({state, commit}, data) {
			if (data['media[type]'] === 'image') {
				if (data['media[image]']) {
					data['media[image]'] = await imageToBlob(data['media[image]']);
				} else {
					const oldData = state.errored.find((marker) => {
						return marker.uploadTime === data.uploadTime;
					});
					data['media[image]'] = oldData['media[image]'];
				}
			}
			commit("removeFromErrored", data.uploadTime);
			commit("pushToQueue", data);

			UploadService.processQueue();

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
		}
	},
}
