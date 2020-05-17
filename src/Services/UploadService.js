import http from '@/Services/HttpService';
import Store from '@/store';
import ImageService from '@/Services/ImageService'
import UploadFile from "@/Classes/UploadFile";

let working = false;

function buildFormData(data, formData, parentKey) {
	if (!formData) {
		formData = new FormData();
	}

	if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File) && !(data instanceof UploadFile)) {
		Object.keys(data).forEach(key => {
			if (key !== 'preview' && key !== 'error' && key !== 'uploadTime') {
				buildFormData(data[key], formData, parentKey ? `${parentKey}[${key}]` : key);
			}
		});
	} else if (data && data instanceof UploadFile) {
		formData.append(`media[files]`, ImageService.stringToBlob(data.image), `${data.name}.jpg`);
	} else {
		formData.append(parentKey, data);
	}

	return formData;
}

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
		const formData = buildFormData(marker);
		let url = 'marker/create';

		if(marker.story){
			url += `/${marker.story}`;
		}

		const response = await http.post(url, formData, {}, {
			onUploadProgress: this.onUploadProgress
		});
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

	onUploadProgress(progressEvent) {
		console.log('progress event');
		Store.commit('Uploads/setProgress', progressEvent.loaded * 100 / progressEvent.total);
	}
}

export default new UploadService;
