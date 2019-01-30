import cache from '@/Services/cache.service';
import UploadService from '@/Services/UploadService';

const uploads = cache.caches().uploads;

export default {
	namespaced: true,

	state: {
		queue: [],
		errored: []
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

	},

	actions: {
		processQueue() {
			UploadService.processQueue();
		},

		async init({state}) {
			await uploads.iterate((data) => {
				if (data.error) {
					state.errored.push(data);
				} else {
					state.queue.push(data);
				}
			});
		},

		async upload({commit}, data) {
			if (data['media[type]'] === 'image') {
				data['media[image]'] = await new Promise((resolve, reject) => {
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
					reader.readAsBinaryString(data['media[image]']);
				});
			}

			data.uploadTime = Date.now();
			await uploads.setItem(data.uploadTime, data);
			commit("pushToQueue", data);
			UploadService.processQueue();
		},

		async uploadError({commit}, marker) {
			this._vm.$toast.error('Please try again later', 'Upload failed');
			commit('removeFromQueue', marker.uploadTime);
			commit('pushToErrored', marker);
			await uploads.setItem(marker.uploadTime, marker);
		},

		async uploaded({commit}, data) {
			await uploads.removeItem(data.uploadKey);

			commit('removeFromQueue', data.uploadKey);
			commit('Markers/addAtStart', data, {
				root: true
			});
		}
	}

}