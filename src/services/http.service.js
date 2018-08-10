import axios from "axios";
import auth from "./authentication.service";

let host = "/api";

class HttpService {
	constructor() {
		axios.interceptors.response.use((response) => {
			if (response.headers.csrftoken || false) {
				this.setHeader('X-CSRF-TOKEN', response.headers.csrftoken);
			}
			return response;
		}, (error) => {
			if (error.response.data.clearToken || false) {
				auth.logout();
			}
			return Promise.reject(error);
		});
	}

	setHeader(key, value) {
		axios.defaults.headers.common[key] = value;
	}

	async get(url, headers = {}) {
		if (url.indexOf('http') !== 0) {
			url = `${host}/${url}`;
		}
		try {
			return await axios.get(url, headers);
		} catch (error) {
			return error.response;
		}
	}

	async post(url, data = {}, headers = {}) {
		try {
			return await axios.post(`${host}/${url}`, data, headers);
		} catch (error) {
			return error.response;
		}
	}

	async delete(url, headers = {}) {
		try {
			return await axios.delete(`${host}/${url}`, headers);
		} catch (error) {
			return false;
		}
	}

	static install(Vue) {
		Vue.prototype.$http = service;
	}
}

const service = new HttpService();

export default service;
export const installer = HttpService;