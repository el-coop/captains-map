import axios from "axios";
import auth from "./authentication.service";

let host = "/api";

class HttpService {
	constructor() {
		axios.interceptors.response.use((response) => {
			return response;
		}, (error) => {
			if (error.response.data.clearToken || false) {
				auth.logout();
				return Promise.reject(error);
			}
		});
		this.getCsrf();
	}

	async getCsrf() {
		try {
			let response = await axios.get(`${host}/csrf-token`);
			this.setHeader('X-CSRF-TOKEN', response.data.csrfToken);
		} catch (error) {
			console.log(error.response);
		}
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