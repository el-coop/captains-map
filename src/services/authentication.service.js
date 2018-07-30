class AuthenticationService {

	saveToken(token) {
		localStorage.setItem('captains-map', token);
		this.token = token;
	}

	getToken() {
		try {
			if (!this.token) {
				this.token = localStorage.getItem('captains-map');
			}
			return this.token;
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	getUserDetails() {
		const token = this.getToken();
		if (token) {
			let payload;
			payload = token.split('.')[1];
			payload = window.atob(payload);
			return JSON.parse(payload);
		} else {
			return null;
		}
	}

	isLoggedIn() {
		const user = this.getUserDetails();
		if (user) {
			return user.exp > Date.now() / 1000;
		} else {
			return false;
		}
	}

	logout() {
		this.token = '';
		window.localStorage.removeItem('captains-map');
	}
}

export default new AuthenticationService();