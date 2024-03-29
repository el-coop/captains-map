import axios from "axios";
import Store from '@/store';

import Cache from '@/Services/Cache';

let host = "/api";

class HttpService {
	constructor() {
		axios.interceptors.response.use((response) => {
			this.setCsrfToken(response);
			this.extendUserLogin(response);
			return response;
		}, this.issueLogout.bind(this));
	}

	setCsrfToken(response) {
		if (response.headers.csrftoken || false) {
			this.setHeader('X-CSRF-TOKEN', response.headers.csrftoken);
			Store.dispatch('CSRFReady');
		}
	}

	extendUserLogin(response) {
		if (response.headers.userextend || false) {
			Store.dispatch('User/extend', response.headers.userextend);
		}
	}

	issueLogout(error) {
		if ((error.response && error.response.data.clearToken) || false) {
			Store.dispatch('User/logout');
		}
		return Promise.reject(error);
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

		if (!error.response || error.response.status !== 404) {
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

	async post(url, data = {}, headers = {}, config = {}, repeat = true) {
		try {
			return await axios.post(`${host}/${url}`, data, {
				headers,
				...config
			});
		} catch (error) {
			if (error.response && error.response.data.message === 'invalid csrf token' && repeat) {
				return await this.repeatWithCsrf('post', url, headers, data, config);
			}
			return error.response;
		}
	}

	async patch(url, data = {}, headers = {}, config = {}, repeat = true) {
		try {
			return await axios.patch(`${host}/${url}`, data, {
				headers,
				...config
			});
		} catch (error) {
			if (error.response && error.response.data.message === 'invalid csrf token' && repeat) {
				return await this.repeatWithCsrf('patch', url, headers, data, config);
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

	async repeatWithCsrf(method, url, headers, data = {}, config = {}) {
		await this.get('getCsrf');
		if (method === "delete") {
			return await this.delete(url, headers, false);
		}

		return await this[method](url, data, headers, config, false);
	}

	static install(app) {
		app.config.globalProperties.$http = service;
	}
}

const service = new HttpService();

export default service;
export const installer = HttpService;
