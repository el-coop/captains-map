import http from '@/Services/HttpService';
import Store from '@/store';
import ImageService from '@/Services/ImageService'

let working = false;

class UploadService {
	async processQueue() {
		if (working) {
			return;
		}
		working = true;

		while (Store.state.Uploads.queue.length > 0) {
			const currentMarker = Store.state.Uploads.queue[0];
			Store.commit('Uploads/markAsWorking', currentMarker.uploadTime);
			await this.upload(currentMarker);
			Store.commit('Uploads/markAsWorking', null);
		}
		working = false;
	}

	async upload(marker) {
		const formData = new FormData();
		for (const key in marker) {
			formData.set(key, marker[key]);
		}
		if (marker['media[type]'] !== 'instagram') {
			formData.set('media[image]', ImageService.stringToBlob(marker['media[image]']), 'upload.jpg');
		}
		const response = await http.post('marker/create', formData);
		if (!response || response.status < 200 || response.status > 299) {
			marker.error = {
				status: response ? response.status : 'offline',
				data: response ? response.data : {}
			};
			await Store.dispatch("Uploads/uploadError", marker);
			return;
		}

		const uploadedMarker = response.data;
		uploadedMarker.uploadTime = marker.uploadTime;

		await Store.dispatch("Uploads/uploaded", uploadedMarker);
	}
}

export default new UploadService;
