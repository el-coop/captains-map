import axios from "axios";
import Store from '@/store';

import Cache from '@/Services/Cache';

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
			if (axios.isCancel(responseError)) {
				return 'canceled';
			}
			error = responseError;
		}

		if(error.response.status !== 404){
			const cachedData = await Cache.get('request', url);

			if (cachedData) {
				return {
					status: 'cached',
					data: cachedData
				}
			}

		}

		return error.response;

	}

	async post(url, data = {}, headers = {}, repeat = true) {
		try {
			return await axios.post(`${host}/${url}`, data, {
				headers
			});
		} catch (error) {
			if (error.response && error.response.data.message === 'invalid csrf token' && repeat) {
				return await this.repeatWithCsrf('post', url, headers, data);
			}
			return error.response;
		}
	}

	async delete(url, headers = {}, repeat = true) {
		try {
			return await axios.delete(`${host}/${url}`, headers);
		} catch (error) {
			if (error.response.data.message === 'invalid csrf token' && repeat) {
				return await this.repeatWithCsrf('delete', url, headers);
			}
			return error.response;
		}
	}

	async repeatWithCsrf(method, url, headers, data = {}) {
		await this.get('getCsrf');
		if (method === "delete") {
			return await this.delete(url, headers, false);
		}
		return await this.post(url, data, headers, false);
	}

	static install(Vue) {
		Vue.prototype.$http = service;
	}
}

const service = new HttpService();

export default service;
export const installer = HttpService;
