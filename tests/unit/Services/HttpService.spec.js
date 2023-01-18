import sinon from 'sinon';
import {describe, it, expect, afterEach, beforeEach, afterAll} from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import http from '@/Services/HttpService';
import cache from '@/Services/Cache';
import Store from '@/store';

describe('Http service', () => {

	const mock = new MockAdapter(axios);


	afterEach(() =>{
		sinon.restore();
	})

	afterAll(() => {
		mock.reset();
	})

	it('Saves CSRF token and notify app', async () => {
		const storeStub = sinon.stub(Store, 'dispatch');

		mock.onGet('/api/test').reply((config) => {
			return [
				200,
				{},
				{
					csrftoken: 'test'
				}
			]
		});
		await http.get('test');
		expect(axios.defaults.headers.common['X-CSRF-TOKEN']).toBe('test');
		expect(storeStub.calledOnce).toBeTruthy();
		expect(storeStub.calledWith('CSRFReady')).toBeTruthy();
	});

	it('Issues as logout when clearToken error is found', async () => {
		const storeStub = sinon.stub(Store, 'dispatch');

		mock.onGet('/api/test').reply((config) => {
			return [
				403,
				{
					clearToken: true
				},
				{}
			]
		});


		await http.get('test');
		expect(storeStub.calledOnce).toBeTruthy();
		expect(storeStub.calledWith('User/logout')).toBeTruthy();
	});

	it('Extends user login when userextend header found', async () => {
		const storeStub = sinon.stub(Store, 'dispatch');

		mock.onGet('/api/test').reply((config) => {
			return [
				200,
				{},
				{
					userextend: 10
				}
			]
		});

		await http.get('test');
		expect(storeStub.calledOnce).toBeTruthy();
		expect(storeStub.calledWith('User/extend', '10')).toBeTruthy();
	});

	it('returns the get response and caches', async () => {
		const cacheStub = sinon.stub(cache, 'store');

		mock.onGet('/api/test').reply((config) => {
			return [
				200,
				{
					message: 'test'
				},
				{}
			]
		});

		const response = await http.get('test');
		expect(response.status).toBe(200);
		expect(response.data).toEqual({
			'message': 'test'
		});
		expect(cacheStub.calledOnce).toBeTruthy();
		expect(cacheStub.calledWith('request', '/api/test', response.data)).toBeTruthy();
	});

	it('returns the cached response on axios error', async () => {
		const cacheStub = sinon.stub(cache, 'get').callsFake(() => {
			return {
				'message': 'cached'
			};
		});

		mock.onGet('/api/test').reply((config) => {
			return [
				400,
				{
					message: 'test'
				},
				{}
			]
		});

		const response = await http.get('test');
		expect(response.status).toBe('cached');
		expect(response.data).toEqual({
			'message': 'cached'
		});
		expect(cacheStub.calledOnce).toBeTruthy();
		expect(cacheStub.calledWith('request', '/api/test')).toBeTruthy();
	});

	it('Doesnt return cached response for 404 error', async () => {
		const cacheStub = sinon.stub(cache, 'get');

		mock.onGet('/api/test').reply((config) => {
			return [
				404,
				{
					message: 'test'
				},
				{}
			]
		});
		const response = await http.get('test');
		expect(response.status).toBe(404);
		expect(response.data).toEqual({
			'message': 'test'
		});
		expect(cacheStub.notCalled).toBeTruthy();
	});


	it('returns the response from get error and no cache', async () => {
		sinon.stub(cache, 'get').callsFake(() => {
			return null;
		});
		mock.onGet('/api/test').reply((config) => {
			return [
				400,
				{
					message: 'test'
				},
				{}
			]
		});
		const response = await http.get('test');
		expect(response.status).toBe(400);
		expect(response.data).toEqual({
			'message': 'test'
		});
	});

	it('returns the response from post', async () => {
		mock.onPost('/api/test').reply((config) => {
			return [
				200,
				{
					message: 'test'
				},
				{}
			]
		});

		const response = await http.post('test');
		expect(response.status).toBe(200);
		expect(response.data).toEqual({
			'message': 'test'
		});
	});


	it('returns the response from patch', async () => {
		mock.onPatch('/api/test').reply((config) => {
			return [
				200,
				{
					message: 'test'
				},
				{}
			]
		});

		const response = await http.patch('test');
		expect(response.status).toBe(200);
		expect(response.data).toEqual({
			'message': 'test'
		});
	});

	it('returns the error response from post', async () => {
		mock.onPost('/api/test').reply((config) => {
			return [
				400,
				{
					message: 'test'
				},
				{}
			]
		});
		const response = await http.post('test');
		expect(response.status).toBe(400);
		expect(response.data).toEqual({
			'message': 'test'
		});
	});

	it('returns the error response from patch', async () => {
		mock.onPatch('/api/test').reply((config) => {
			return [
				400,
				{
					message: 'test'
				},
				{}
			]
		});

		const response = await http.patch('test');
		expect(response.status).toBe(400);
		expect(response.data).toEqual({
			'message': 'test'
		});
	});

	it('returns the response from delete', async () => {
		mock.onDelete('/api/test').reply((config) => {
			return [
				200,
				{
					message: 'test'
				},
				{}
			]
		});

		const response = await http.delete('test');
		expect(response.status).toBe(200);
		expect(response.data).toEqual({
			'message': 'test'
		});
	});

	it('returns the error response from delete', async () => {
		mock.onDelete('/api/test').reply((config) => {
			return [
				400,
				{
					message: 'test'
				},
				{}
			]
		});

		const response = await http.delete('test');
		expect(response.status).toBe(400);
		expect(response.data).toEqual({
			'message': 'test'
		});
	});

	it('repeats request from post with csrf error', async () => {
		let calls = 0;
		let responses = [[
			403,
			{
				message: 'invalid csrf token'
			},
			{}
		], [
			200,
			{
				message: 'test'
			},
			{}
		]];
		mock.onGet('/api/getCsrf').reply(200,
			{},
			{
				csrftoken: 'test'
			});
		mock.onPost('/api/test').reply((config) => {
			const response = responses[calls];
			calls++;
			return response;
		});

		const response = await http.post('test');
		expect(axios.defaults.headers.common['X-CSRF-TOKEN']).toBe('test');
		expect(response.status).toBe(200);
		expect(response.data).toEqual({
			'message': 'test'
		});
	});

	it('repeats request from patch with csrf error', async () => {
		let calls = 0;
		let responses = [[
			403,
			{
				message: 'invalid csrf token'
			},
			{}
		], [
			200,
			{
				message: 'test'
			},
			{}
		]];

		mock.onGet('/api/getCsrf').reply(200,
			{},
			{
				csrftoken: 'test'
			});
		mock.onPatch('/api/test').reply((config) => {
			const response = responses[calls];
			calls++;
			return response;
		});

		const response = await http.patch('test');

		expect(axios.defaults.headers.common['X-CSRF-TOKEN']).toBe('test');
		expect(response.status).toBe(200);
		expect(response.data).toEqual({
			'message': 'test'
		});
	});

	it('repeats request from delete with csrf error', async () => {
		let calls = 0;
		let responses = [[
			403,
			{
				message: 'invalid csrf token'
			},
			{}
		], [
			200,
			{
				message: 'test'
			},
			{}
		]];

		mock.onGet('/api/getCsrf').reply(200,
			{},
			{
				csrftoken: 'test'
			});
		mock.onDelete('/api/test').reply((config) => {
			const response = responses[calls];
			calls++;
			return response;
		});

		const response = await http.delete('test');
		expect(axios.defaults.headers.common['X-CSRF-TOKEN']).toBe('test');
		expect(response.status).toBe(200);
		expect(response.data).toEqual({
			'message': 'test'
		});
	});
});

