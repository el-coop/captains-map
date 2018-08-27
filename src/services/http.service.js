import axios from "axios";
import userStore from '../store/user';

let host = "/api";

class HttpService {
	constructor() {
		axios.interceptors.response.use(this.setCsrfToken.bind(this), this.issueLogout.bind(this));
	}

	issueLogout(error) {
		if (error.response.data.clearToken || false) {
			userStore.actions.logout();
		}
		return Promise.reject(error);
	}

	setCsrfToken(response) {
		if (response.headers.csrftoken || false) {
			this.setHeader('X-CSRF-TOKEN', response.headers.csrftoken);
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