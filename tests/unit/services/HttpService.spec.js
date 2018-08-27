import sinon from 'sinon';
import { assert } from 'chai';
import axios from 'axios';
import moxios from 'moxios';
import http from '@/services/http.service';
import userStore from '@/store/user';

describe('Http service', () => {
	beforeEach(() => {
		moxios.install()
	});

	afterEach('Reset sinon and settings', () => {
		sinon.restore();
		moxios.uninstall();
	});

	it('Saves CSRF token', async () => {
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
	});

	it('Issues as logout when clearToken error is found', async () => {
		const logoutStub = sinon.stub(userStore.actions, 'logout');
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
		assert.isTrue(logoutStub.calledOnce);
	});

	it('returns the get response', async () => {
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
	});

	it('returns the response from get error', async () => {
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

