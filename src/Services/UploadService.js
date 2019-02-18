import http from '@/Services/http.service';
import Store from '@/store';

const stringToBlob = Symbol('Convert string to blob');
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
			formData.set('media[image]', this[stringToBlob](marker['media[image]']), 'upload.jpg');
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

	[stringToBlob](imageString) {
		const byteCharacters = imageString;
		const byteArrays = [];

		for (let offset = 0; offset < byteCharacters.length; offset += 512) {
			const slice = byteCharacters.slice(offset, offset + 512);

			const byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			const byteArray = new Uint8Array(byteNumbers);

			byteArrays.push(byteArray);
		}

		return new Blob(byteArrays, {
			type: 'image/jpeg'
		});
	}
}

export default new UploadService;
