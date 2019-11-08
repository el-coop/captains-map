import sinon from 'sinon';
import { assert } from 'chai';
import Store from '@/store';
import userStore from '@/store/user';
import cache from '@/Services/Cache';
import router from '@/router';
import http from '@/Services/HttpService';

describe('User Store', () => {

	afterEach('Reset sinon and settings', () => {
		sinon.restore();
	});

	it('Initializes user from cache', async () => {
		const user = {
			username: 'test',
			id: 1
		};
		sinon.stub(cache, 'get').returns(user);
		const state = {user: null};
		await userStore.actions.init({state});

		assert.deepEqual(state.user, user);
		assert.isTrue(state.initialized);
	});

	it('Returns false when no user in state', async () => {
		const state = {
			user: null,
			initialized: true
		};
		const dispatch = sinon.stub();

		assert.isFalse(await userStore.actions.isLoggedIn({state, dispatch}));
		assert.isFalse(dispatch.calledOnce);
	});

	it('Returns false when expired user in state', async () => {
		const state = {
			user: {
				exp: 0
			},
			initialized: true
		};
		const dispatch = sinon.stub();

		assert.isFalse(await userStore.actions.isLoggedIn({state, dispatch}));
		assert.isTrue(dispatch.calledOnce);
		assert.isTrue(dispatch.calledWith('logout'));
	});

	it('Returns true when expired user in state', async () => {
		const state = {
			user: {
				exp: Date.now() + 10000000
			},
			initialized: true
		};
		const dispatch = sinon.stub();

		assert.isTrue(await userStore.actions.isLoggedIn({state, dispatch}));
		assert.isFalse(dispatch.calledOnce);
	});


	it('Initializes if not initialized', async () => {
		const state = {
			user: false,
			initialized: false
		};
		const dispatch = sinon.stub();

		assert.isFalse(await userStore.actions.isLoggedIn({state, dispatch}));
		assert.isTrue(dispatch.calledOnce);
		assert.isTrue(dispatch.firstCall.calledWith('init'));
	});

	it('Calls log out and redirects on logout', async () => {

		const cacheStub = sinon.stub(cache, 'forget');
		const routerStub = sinon.stub(router, 'push');
		sinon.stub(router, 'currentRoute').value({
			path: '/edit'
		});
		const httpStub = sinon.stub(http, 'get').callsFake(() => {
			return {status: 200,}
		});

		const state = {
			user: {
				exp: Date.now() + 10000000
			}
		};
		const dispatch = sinon.stub();


		await userStore.actions.logout({state, dispatch});

		assert.isNull(state.user);

		assert.isTrue(dispatch.calledOnce);
		assert.isTrue(dispatch.calledWith('Uploads/purge'));
		assert.isTrue(cacheStub.calledOnce);
		assert.isTrue(cacheStub.calledWith('settings', 'user'));

		assert.isTrue(httpStub.calledOnce);
		assert.isTrue(httpStub.calledWith('auth/logout'));

		assert.isTrue(routerStub.calledWith('/'));
		assert.isTrue(routerStub.calledOnce);
	});

	it('Login returns true when user logs in', async () => {
		const cacheStub = sinon.stub(cache, 'store');
		const user = {
			id: 1,
			username: 'test',
			exp: 1
		};
		sinon.stub(http, 'post').callsFake(() => {
			return {
				status: 200,
				data: {
					user
				}
			}
		});
		const state = {};

		const response = await userStore.actions.login({
			commit: {},
			state
		}, {});

		assert.isTrue(response);
		assert.deepEqual(state, {
			user
		});
		assert.isTrue(cacheStub.calledOnce);
		assert.isTrue(cacheStub.firstCall.calledWith('settings', 'user', {
			id: user.id,
			username: user.username,
			exp: user.exp,
		}));
	});

	it('Login returns false when user fails to log in', async () => {
		const cacheStub = sinon.stub(cache, 'store');
		sinon.stub(http, 'post').callsFake(() => {
			return {
				status: 403,
			}
		});
		const state = {
			user: null
		};

		const response = await userStore.actions.login({
			commit: {},
			state
		}, {});

		assert.isFalse(response);
		assert.isNull(state.user);
		assert.isFalse(cacheStub.called);
	});

	it('Extend extends user login duration', async () => {
		const cacheStub = sinon.stub(cache, 'store');

		const state = {
			user: {
				id: 1,
				username: 'test',
				exp: 1
			}
		};

		await userStore.actions.extend({state}, 100);

		assert.equal(state.user.exp, 100);
		assert.isTrue(cacheStub.calledOnce);
		assert.isTrue(cacheStub.firstCall.calledWith('settings', 'user', {
			id: 1,
			username: 'test',
			exp: 100,
		}));
	});
});
