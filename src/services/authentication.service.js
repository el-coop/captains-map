class AuthenticationService {

	saveUser(user) {
		localStorage.setItem('captains-map.user_id', user.id);
		localStorage.setItem('captains-map.username', user.username);
		localStorage.setItem('captains-map.exp', user.exp);
		this.user = user;
	}

	getUserDetails() {
		try {
			if (!this.user) {
				this.user = {
					id: localStorage.getItem('captains-map.user_id'),
					username: localStorage.getItem('captains-map.username'),
					exp: localStorage.getItem('captains-map.exp'),
				};
			}
			return this.user;
		} catch (error) {
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
		this.user = '';
		localStorage.removeItem('captains-map.user_id');
		localStorage.removeItem('captains-map.username');
		localStorage.removeItem('captains-map.exp');
	}
}

export default new AuthenticationService();