import sinon from 'sinon';
import { assert } from 'chai';
import axios from 'axios';
import moxios from 'moxios';
import http from '@/Services/http.service';
import cache from '@/Services/cache.service';
import Store from '@/store';

describe('Http service', () => {
	beforeEach(() => {
		moxios.install()
	});

	afterEach('Reset sinon and settings', () => {
		sinon.restore();
		moxios.uninstall();
	});

	it('Saves CSRF token and notify app', async () => {
		const storeStub = sinon.stub(Store, 'dispatch');

		moxios.wait(() => {
			let request = moxios.requests.mostRecent();
			request.respondWith({
				status: 200,
				headers: {
					csrftoken: 'test'
				}
			});
		});
		await http.get('test');
		assert.equal(axios.defaults.headers.common['X-CSRF-TOKEN'], 'test');
		assert.isTrue(storeStub.calledOnce);
		assert.isTrue(storeStub.calledWith('CSRFReady'));
	});

	it('Issues as logout when clearToken error is found', async () => {
		const storeStub = sinon.stub(Store, 'dispatch');
		moxios.wait(() => {
			let request = moxios.requests.mostRecent();
			request.respondWith({
				status: 403,
				response: {
					clearToken: true
				}
			});
		});
		await http.get('test');
		assert.isTrue(storeStub.calledOnce);
		assert.isTrue(storeStub.calledWith('User/logout'));
	});

	it('returns the get response and caches', async () => {
		const cacheStub = sinon.stub(cache, 'store');
		moxios.wait(() => {
			let request = moxios.requests.mostRecent();
			request.respondWith({
				status: 200,
				headers: {},
				response: {
					message: 'test'
				}
			});
		});
		const response = await http.get('test');
		assert.equal(response.status, 200);
		assert.deepEqual(response.data, {
			'message': 'test'
		});
		assert.isTrue(cacheStub.calledOnce);
		assert.isTrue(cacheStub.calledWith('request', '/api/test', response.data));
	});

	it('returns the cached response on axios error', async () => {
		const cacheStub = sinon.stub(cache, 'get').callsFake(() => {
			return {
				'message': 'cached'
			};
		});
		moxios.wait(() => {
			let request = moxios.requests.mostRecent();
			request.respondWith({
				status: 400,
				headers: {},
				response: {
					message: 'test'
				}
			});
		});
		const response = await http.get('test');
		assert.equal(response.status, 'cached');
		assert.deepEqual(response.data, {
			'message': 'cached'
		});
		assert.isTrue(cacheStub.calledOnce);
		assert.isTrue(cacheStub.calledWith('request', '/api/test'));
	});


	it('returns the response from get error and no cache', async () => {
		sinon.stub(cache, 'get').callsFake(() => {
			return null;
		});
		moxios.wait(() => {
			let request = moxios.requests.mostRecent();
			request.respondWith({
				status: 400,
				headers: {},
				response: {
					message: 'test'
				}
			});
		});
		const response = await http.get('test');
		assert.equal(response.status, 400);
		assert.deepEqual(response.data, {
			'message': 'test'
		});
	});

	it('returns the response from post', async () => {
		moxios.wait(() => {
			let request = moxios.requests.mostRecent();
			request.respondWith({
				status: 200,
				headers: {},
				response: {
					message: 'test'
				}
			});
		});
		const response = await http.post('test');
		assert.equal(response.status, 200);
		assert.deepEqual(response.data, {
			'message': 'test'
		});
	});

	it('returns the error response from post', async () => {
		moxios.wait(() => {
			let request = moxios.requests.mostRecent();
			request.respondWith({
				status: 400,
				headers: {},
				response: {
					message: 'test'
				}
			});
		});
		const response = await http.post('test');
		assert.equal(response.status, 400);
		assert.deepEqual(response.data, {
			'message': 'test'
		});
	});

	it('returns the response from delete', async () => {
		moxios.wait(() => {
			let request = moxios.requests.mostRecent();
			request.respondWith({
				status: 200,
				headers: {},
				response: {
					message: 'test'
				}
			});
		});
		const response = await http.delete('test');
		assert.equal(response.status, 200);
		assert.deepEqual(response.data, {
			'message': 'test'
		});
	});

	it('returns the error response from delete', async () => {
		moxios.wait(() => {
			let request = moxios.requests.mostRecent();
			request.respondWith({
				status: 400,
				headers: {},
				response: {
					message: 'test'
				}
			});
		});
		const response = await http.delete('test');
		assert.equal(response.status, 400);
		assert.deepEqual(response.data, {
			'message': 'test'
		});
	});
});

