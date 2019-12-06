import http from "@/Services/HttpService";

class ErrorsLogger {
	handle(error, vm = {}) {
		http.post('/errors', {
			url: window.location.href,
			userAgent: navigator.userAgent || '',
			error: {
				name: error.name,
				stack: error.stack,
				message: error.message
			},
			vm: {
				props: vm.$options ? vm.$options.propsData : {},
				data: vm._data || {}
			}
		});

	}
}

export default new ErrorsLogger();
