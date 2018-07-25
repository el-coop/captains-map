import axios from "axios";
import auth from "./authentication.service";

let host = "/api";

class HttpService {
	constructor() {
		axios.interceptors.request.use(function (config) {
			config.headers.jwt = auth.getToken();
			return config;
		}, function (error) {
			return Promise.reject(error);
		});
		this.getCsrf();
	}

	async getCsrf() {
		try {
			let response = await axios.get(`${host}/csrf-token`);
			this.setHeader('X-CSRF-TOKEN', response.data.csrfToken);
		} catch (error) {
			console.log(error);
		}
	}

	setHeader(key, value) {
		axios.defaults.headers.common[key] = value;
	}

	async get(url, headers = {}) {
		try {
			return await axios.get(`${host}/${url}`, headers);
		} catch (error) {
			return error;
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