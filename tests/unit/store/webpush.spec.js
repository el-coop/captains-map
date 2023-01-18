import sinon from 'sinon';
import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import store from '@/store';
import http from '@/Services/HttpService';

describe('Webpush Store', () => {

	beforeEach(() => {
		global.navigator.serviceWorker = sinon.stub();
		global.window.PushManager = {
			getSubscription: sinon.stub()
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('Initializes when no registration yet', async () => {
		const registrationStub = {
			pushManager: {
				getSubscription: sinon.stub().returns(null)
			}
		};
		await store.dispatch('Webpush/initialize', registrationStub)

		expect(store.state.Webpush.hasPush).toBeTruthy();
		expect(store.state.Webpush.registration).toEqual(registrationStub);
		expect(store.state.Webpush.subscription).toBeNull();
		expect(store.state.Webpush.following).toEqual([]);
	});

	it('Initializes when registration exists', async () => {
		const subscription = {
			endpoint: 'entpoint'
		};
		const following = ['nur'];
		sinon.stub(http, 'get').returns({
			status: 200,
			data: following
		});
		const registrationStub = {
			pushManager: {
				getSubscription: sinon.stub().returns(subscription)
			}
		};
		await store.dispatch('Webpush/initialize', registrationStub);

		expect(store.state.Webpush.hasPush).toBeTruthy();
		expect(store.state.Webpush.registration).toEqual(registrationStub);
		expect(store.state.Webpush.subscription).toEqual(subscription);
		expect(store.state.Webpush.following).toEqual(following);
	});

	it('Registers when there is no subscription', async () => {
		const subscription = {
			endpoint: 'entpoint'
		};
		store.state.Webpush.subscription = null;
		store.state.Webpush.following = [];
		store.state.Webpush.registration = {
			pushManager: {
				subscribe: sinon.stub().returns(subscription)
			}
		};

		sinon.stub(http, 'get').returns({
			status: 200,
			data: {key: 'asd'},
		});

		sinon.stub(http, 'post').returns({
			status: 201,
		});

		const response = await store.dispatch('Webpush/toggleFollow', 'nur');

		expect(response).toBeTruthy();
		expect(store.state.Webpush.following).toEqual(['nur']);
	});

	it('Returns false when subscription fails', async () => {
		const subscription = {
			endpoint: 'entpoint'
		};
		store.state.Webpush.subscription = null;
		store.state.Webpush.following = [];
		store.state.Webpush.registration = {
			pushManager: {
				subscribe: sinon.stub().returns(subscription)
			}
		};

		sinon.stub(http, 'get').returns({
			status: 500,
			data: 'asd',
		});


		const response = await store.dispatch('Webpush/toggleFollow', 'nur');

		expect(response).toBeFalsy();
		expect(store.state.Webpush.following).toEqual([]);
	});

	it('Toggles follow', async () => {
		store.state.Webpush.subscription = {
			endpoint: 'entpoint'
		};
		store.state.Webpush.following = [];

		sinon.stub(http, 'post').returns({
			status: 201,
		});

		const response = await store.dispatch('Webpush/toggleFollow', 'nur');

		expect(response).toBeTruthy();
		expect(store.state.Webpush.following).toEqual(['nur']);
	});

	it('Toggles follow off', async () => {
		store.state.Webpush.subscription = {
			endpoint: 'entpoint'
		};
		store.state.Webpush.following = ['nur'];

		sinon.stub(http, 'post').returns({
			status: 200
		});

		const response = await store.dispatch('Webpush/toggleFollow', 'nur');

		expect(response).toBeTruthy();
		expect(store.state.Webpush.following).toEqual([]);
	});

	it('Returns false when errors', async () => {
		store.state.Webpush.subscription = {
			endpoint: 'entpoint'
		};
		store.state.Webpush.following = ['nur'];

		sinon.stub(http, 'post').returns({
			status: 500
		});

		const response = await store.dispatch('Webpush/toggleFollow', 'nur');

		expect(response).toBeFalsy();
		expect(store.state.Webpush.following).toEqual(['nur']);
	});
});
