import axios from "axios";

let host = "/api";

export default class HttpService {
	constructor() {
		this.getCsrf();
	}

	async getCsrf() {
		try {
			let response = await axios.get(`${host}/csrf-token`);
			axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data.csrfToken;
		} catch (error) {
			console.log(error);
		}
	}

	async post(url, data, headers) {
		try {
			let response = await axios.post(`${host}/${url}`, data, headers);
			return response;
		} catch (error) {
			return error;
		}
	}

	static install(Vue) {
		Vue.prototype.$http = new HttpService();
	}
}


