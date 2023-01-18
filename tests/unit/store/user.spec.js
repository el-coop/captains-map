import sinon from 'sinon';
import {describe, it, expect, afterEach} from 'vitest';
import Store from '@/store';
import userStore from '@/store/user';
import cache from '@/Services/Cache';
import router from '@/router';
import http from '@/Services/HttpService';

describe('User Store', () => {

	afterEach(() => {
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

		expect(state.user).toEqual(user);
		expect(state.initialized).toBeTruthy();
	});

	it('Returns false when no user in state', async () => {
		const state = {
			user: null,
			initialized: true
		};
		const dispatch = sinon.stub();

		expect(await userStore.actions.isLoggedIn({state, dispatch})).toBeFalsy();
		expect(dispatch.calledOnce).toBeFalsy();
	});

	it('Returns false when expired user in state', async () => {
		const state = {
			user: {
				exp: 0
			},
			initialized: true
		};
		const dispatch = sinon.stub();

		expect(await userStore.actions.isLoggedIn({state, dispatch})).toBeFalsy();
		expect(dispatch.calledOnce).toBeTruthy();
		expect(dispatch.calledWith('logout')).toBeTruthy();
	});

	it('Returns true when expired user in state', async () => {
		const state = {
			user: {
				exp: Date.now() + 10000000
			},
			initialized: true
		};
		const dispatch = sinon.stub();

		expect(await userStore.actions.isLoggedIn({state, dispatch})).toBeTruthy();
		expect(dispatch.calledOnce).toBeFalsy();
	});


	it('Initializes if not initialized', async () => {
		const state = {
			user: false,
			initialized: false
		};
		const dispatch = sinon.stub();

		expect(await userStore.actions.isLoggedIn({state, dispatch})).toBeFalsy();
		expect(dispatch.calledOnce).toBeTruthy();
		expect(dispatch.firstCall.calledWith('init')).toBeTruthy();
	});

	it('Calls log out and redirects on logout', async () => {

		const cacheStub = sinon.stub(cache, 'forget');
		const cacheClearStub = sinon.stub(cache, 'clear');
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

		expect(state.user).toBeNull();

		expect(dispatch.calledTwice).toBeTruthy();
		expect(dispatch.firstCall.calledWith('Uploads/purge')).toBeTruthy();
		expect(dispatch.secondCall.calledWith('Profile/purge')).toBeTruthy();
		expect(cacheStub.calledOnce).toBeTruthy();
		expect(cacheStub.calledWith('settings', 'user')).toBeTruthy();
		expect(cacheClearStub.calledOnce).toBeTruthy();
		expect(cacheClearStub.calledWith('requests')).toBeTruthy();

		expect(httpStub.calledOnce).toBeTruthy();
		expect(httpStub.calledWith('auth/logout')).toBeTruthy();

		expect(routerStub.calledWith('/')).toBeTruthy();
		expect(routerStub.calledOnce).toBeTruthy();
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
		const dispatch = sinon.stub();

		const response = await userStore.actions.login({
			commit: {},
			state,
			dispatch
		}, {});

		expect(dispatch.called).toBeTruthy();
		expect(dispatch.calledWith('Profile/purge', {}, {root: true})).toBeTruthy();
		expect(response).toBeTruthy();
		expect(state).toEqual({
			user
		});
		expect(cacheStub.calledOnce).toBeTruthy();
		expect(cacheStub.firstCall.calledWith('settings', 'user', {
			id: user.id,
			username: user.username,
			exp: user.exp,
		})).toBeTruthy();
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

		expect(response).toBeFalsy();
		expect(state.user).toBeNull();
		expect(cacheStub.called).toBeFalsy();
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

		expect(state.user.exp).toBe(100);
		expect(cacheStub.calledOnce).toBeTruthy();
		expect(cacheStub.firstCall.calledWith('settings', 'user', {
			id: 1,
			username: 'test',
			exp: 100,
		})).toBeTruthy();
	});
});
