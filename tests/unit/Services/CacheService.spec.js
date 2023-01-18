import sinon from 'sinon';
import {describe, it, expect, afterEach} from 'vitest';
import cache from '@/Services/Cache';

describe('Cache Service', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Gets value from requested cache', async () => {
		const caches = cache.caches();
		sinon.stub(caches.request, 'getItem').callsFake(() => {
			return {
				value: 'request'
			};
		});
		sinon.stub(caches.map, 'getItem').callsFake(() => {
			return {
				value: 'map'
			};
		});
		const result = await cache.get('request', 'key');

		expect(result).toBe('request');
	});

	it('Returns null when no value', async () => {
		const caches = cache.caches();
		sinon.stub(caches.request, 'getItem').callsFake(() => {
			return null;
		});
		const result = await cache.get('request', 'key');

		expect(result).toBeNull();
	});

	it('Returns default valye when no value and default given', async () => {
		const caches = cache.caches();
		sinon.stub(caches.request, 'getItem').callsFake(() => {
			return null;
		});
		const result = await cache.get('request', 'key', 'default');

		expect(result).toBe('default');
	});

	it('Expires data', async () => {
		const caches = cache.caches();
		const forgetSpy = sinon.spy(cache, 'forget');
		sinon.stub(caches.request, 'getItem').callsFake(() => {
			return {
				value: 'data',
				expiry: Date.now() - 1000
			};
		});
		const result = await cache.get('request', 'key');

		expect(result).toBeNull();
		expect(forgetSpy.calledOnce).toBeTruthy();
		expect(forgetSpy.calledWith('request', 'key')).toBeTruthy();
	});

	it('Forgets data', async () => {
		const caches = cache.caches();
		const removeItemStub = sinon.stub(caches.request, 'removeItem');

		await cache.forget('request', 'key');

		expect(removeItemStub.calledOnce).toBeTruthy();
		expect(removeItemStub.calledWith('key')).toBeTruthy();
	});

	it('Stores data', async () => {
		const caches = cache.caches();
		const setItemStub = sinon.stub(caches.request, 'setItem');

		await cache.store('request', 'key', 'value');

		expect(setItemStub.calledOnce).toBeTruthy();
		expect(setItemStub.calledWith('key', {
			value: 'value',
			expiry: null
		})).toBeTruthy();
	});

	it('Stores data with expiration', async () => {
		const caches = cache.caches();
		const setItemStub = sinon.stub(caches.request, 'setItem');

		const expiry = Date.now() + 100;
		await cache.store('request', 'key', 'value', 100);

		expect(setItemStub.calledOnce).toBeTruthy();
		expect(setItemStub.calledWith('key', {
			value: 'value',
			expiry
		})).toBeTruthy();
	});

	it('Clears Cache', async () => {
		const caches = cache.caches();
		const clearCacheStub = sinon.stub(caches.request, 'clear');

		const expiry = Date.now() + 100;
		await cache.clear('request');

		expect(clearCacheStub.calledOnce).toBeTruthy();
	});
});
