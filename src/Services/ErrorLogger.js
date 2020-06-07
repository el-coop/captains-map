import http from "@/Services/HttpService";

class ErrorsLogger {
	handle(error, vm = {}) {
		http.post('errors', {
			url: window.location.href,
			userAgent: navigator.userAgent || '',
			error: {
				name: error.name,
				message: error.message,
				stack: error.stack,
			},
			vm: {
				tag: vm.$options ? vm.$options._componentTag : '',
				props: vm.$options ? vm.$options.propsData : {},
			}
		});
	}
}

export default new ErrorsLogger();
