import sinon from 'sinon';
import { assert } from 'chai';
import { actions } from '@/store';
import cache from '@/Services/Cache';
import router from '@/router';

describe('Store', () => {

	afterEach('Reset sinon and settings', () => {
		sinon.restore();
	});

	it('Updates csrf status', () => {

		const dispatch = sinon.stub();
		const state = {
			hasCsrf: false
		};

		actions.CSRFReady({state, dispatch});

		assert.isTrue(state.hasCsrf);
		assert.isTrue(dispatch.calledOnce);
		assert.isTrue(dispatch.calledWith('Uploads/processQueue'));
	});

	it('Doesnt dispatch processQueue on subsequent calls', () => {

		const dispatch = sinon.stub();
		const state = {
			hasCsrf: true
		};

		actions.CSRFReady({state, dispatch});

		assert.isTrue(state.hasCsrf);
		assert.isFalse(dispatch.calledOnce);
	});

	it('Toggles user marker on when its been toggled', async () => {
		const cacheStub = sinon.stub(cache, 'get');
		cacheStub.onFirstCall().returns(true);
		cacheStub.onSecondCall().returns(false);

		const dispatch = sinon.stub();

		await actions.initSettings({dispatch});

		assert.isTrue(dispatch.calledTwice);
		assert.isTrue(dispatch.firstCall.calledWith('User/init'));
		assert.isTrue(dispatch.secondCall.calledWith('Markers/toggleUserMarker'));
	});

	it('doesnt toggle user marker on when its not cached as toggled', async () => {
		sinon.stub(cache, 'get').returns(false);

		const dispatch = sinon.stub();

		await actions.initSettings({dispatch});

		assert.isTrue(dispatch.calledOnce);
	});

	it('Routes to edit when its been cached on edit', async () => {
		const cacheStub = sinon.stub(cache, 'get');
		const routerStub = sinon.stub(router, 'push');
		cacheStub.onFirstCall().returns(false);
		cacheStub.onSecondCall().returns('/edit');

		await actions.initSettings({
			dispatch: sinon.stub()
		});

		assert.isTrue(routerStub.calledOnce);
		assert.isTrue(routerStub.calledWith('/edit'));
	});

	it('Routes to story when its been cached on edit', async () => {
		const cacheStub = sinon.stub(cache, 'get');
		const routerStub = sinon.stub(router, 'push');
		cacheStub.onFirstCall().returns(false);
		cacheStub.onSecondCall().returns('/user/story/1');

		await actions.initSettings({
			dispatch: sinon.stub()
		});

		assert.isTrue(routerStub.calledOnce);
		assert.isTrue(routerStub.calledWith('/user/story/1'));
	});

	it('Doesnt change when no route is cached', async () => {
		const cacheStub = sinon.stub(cache, 'get');
		const routerStub = sinon.stub(router, 'push');
		cacheStub.onFirstCall().returns(false);
		cacheStub.onSecondCall().returns(false);

		await actions.initSettings({
			dispatch: sinon.stub()
		});

		assert.isFalse(routerStub.called);
	});

	it('Doesnt change when already on route', async () => {
		const cacheStub = sinon.stub(cache, 'get');
		const routerStub = sinon.stub(router, 'push');
		cacheStub.onFirstCall().returns(false);
		cacheStub.onSecondCall().returns('/');

		await actions.initSettings({
			dispatch: sinon.stub()
		});

		assert.isFalse(routerStub.called);
	});

});
