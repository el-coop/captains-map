import Store from '@/store';

class AuthMiddleware {
	async handle(to, from, next) {
		if (await Store.dispatch('User/isLoggedIn')) {
			return next();
		}
		return next('/');
	}
}

export default new AuthMiddleware();
