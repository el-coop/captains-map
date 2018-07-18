import Auth from '../services/authentication.service';

class AuthMiddleware {
	handle(to, from, next) {
		if (Auth.isLoggedIn()) {
			return next();
		}
		return next('/');
	}
}

export default new AuthMiddleware();