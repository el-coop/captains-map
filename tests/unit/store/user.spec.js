import sinon from 'sinon';
import { assert } from 'chai';
import auth from '@/services/authentication.service';
import userStore from '@/store/user';
import router from '@/router';
import http from '@/services/http.service';

describe('User Store', () => {

	afterEach('Reset sinon and settings', () => {
		sinon.restore();
	});

	it('Calls log out and pushes a redirect on logout', () => {
		const logoutStub = sinon.stub(auth, 'logout');
		const routerStub = sinon.stub(router, 'push');

		userStore.actions.logout();

		assert.isTrue(logoutStub.calledOnce);
		assert.isTrue(routerStub.calledWith('/'));
		assert.isTrue(routerStub.calledOnce);
	});

	it('Login returns true when user logs in', async () => {
		const user = {
			id: 1
		};
		sinon.stub(http, 'post').callsFake(() => {
			return {
				status: 200,
				data: {
					user
				}
			}
		});
		const authStub = sinon.stub(auth, 'saveUser');

		const response = await userStore.actions.login({
			commit: {}
		}, {});

		assert.isTrue(response);
		assert.isTrue(authStub.calledWith(user));
		assert.isTrue(authStub.calledOnce);
	});

	it('Login returns false when user fails to log in', async () => {
		sinon.stub(http, 'post').callsFake(() => {
			return {
				status: 403,
			}
		});
		const authStub = sinon.stub(auth, 'saveUser');

		const response = await userStore.actions.login({
			commit: {}
		}, {});

		assert.isFalse(response);
		assert.isFalse(authStub.called);
	});
});