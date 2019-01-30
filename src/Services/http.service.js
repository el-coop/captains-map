import axios from "axios";
import Store from '@/store';

import Cache from '@/Services/cache.service';

let host = "/api";

class HttpService {
	constructor() {
		axios.interceptors.response.use(this.setCsrfToken.bind(this), this.issueLogout.bind(this));
	}

	issueLogout(error) {
		if ((error.response && error.response.data.clearToken) || false) {
			Store.dispatch('User/logout');
		}
		return Promise.reject(error);
	}

	setCsrfToken(response) {
		if (response.headers.csrftoken || false) {
			this.setHeader('X-CSRF-TOKEN', response.headers.csrftoken);
			Store.dispatch('CSRFReady');
		}
		return response;
	}

	setHeader(key, value) {
		axios.defaults.headers.common[key] = value;
	}

	async get(url, headers = {}) {
		if (url.indexOf('http') !== 0) {
			url = `${host}/${url}`;
		}
		let error;
		try {
			const response = await axios.get(url, headers);
			Cache.store('request', url, response.data);
			return response;
		} catch (responseError) {
			error = responseError;
		}

		const cachedData = await Cache.get('request', url);

		if (cachedData) {
			return {
				status: 'cached',
				data: cachedData
			}
		}

		return error.response;

	}

	async post(url, data = {}, headers = {}) {
		try {
			return await axios.post(`${host}/${url}`, data, {
				headers
			});
		} catch (error) {
			return error.response;
		}
	}

	async delete(url, headers = {}) {
		try {
			return await axios.delete(`${host}/${url}`, headers);
		} catch (error) {
			return error.response;
		}
	}

	static install(Vue) {
		Vue.prototype.$http = service;
	}
}

const service = new HttpService();

export default service;
export const installer = HttpService;
