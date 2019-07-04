import sinon from 'sinon';
import { assert } from 'chai';
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

		assert.equal(result, 'request');
	});

	it('Returns null when no value', async () => {
		const caches = cache.caches();
		sinon.stub(caches.request, 'getItem').callsFake(() => {
			return null;
		});
		const result = await cache.get('request', 'key');

		assert.equal(result, null);
	});

	it('Returns default valye when no value and default given', async () => {
		const caches = cache.caches();
		sinon.stub(caches.request, 'getItem').callsFake(() => {
			return null;
		});
		const result = await cache.get('request', 'key', 'default');

		assert.equal(result, 'default');
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

		assert.equal(result, null);
		assert.isTrue(forgetSpy.calledOnce);
		assert.isTrue(forgetSpy.calledWith('request', 'key'));
	});

	it('Forgets data', async () => {
		const caches = cache.caches();
		const removeItemStub = sinon.stub(caches.request, 'removeItem');

		await cache.forget('request', 'key');

		assert.isTrue(removeItemStub.calledOnce);
		assert.isTrue(removeItemStub.calledWith('key'));
	});

	it('Stores data', async () => {
		const caches = cache.caches();
		const setItemStub = sinon.stub(caches.request, 'setItem');

		await cache.store('request', 'key', 'value');

		assert.isTrue(setItemStub.calledOnce);
		assert.isTrue(setItemStub.calledWith('key', {
			value: 'value',
			expiry: null
		}));
	});

	it('Stores data with expiration', async () => {
		const caches = cache.caches();
		const setItemStub = sinon.stub(caches.request, 'setItem');

		const expiry = Date.now() + 100;
		await cache.store('request', 'key', 'value', 100);

		assert.isTrue(setItemStub.calledOnce);
		assert.isTrue(setItemStub.calledWith('key', {
			value: 'value',
			expiry
		}));
	});

	it('Clears Cache', async () => {
		const caches = cache.caches();
		const clearCacheStub = sinon.stub(caches.request, 'clear');

		const expiry = Date.now() + 100;
		await cache.clear('request');

		assert.isTrue(clearCacheStub.calledOnce);
	});
});
