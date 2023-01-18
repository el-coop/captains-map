import sinon from 'sinon';
import {describe, it, expect, afterEach} from 'vitest';
import { actions } from '@/store';
import cache from '@/Services/Cache';
import router from '@/router';

describe('Store', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Updates csrf status', () => {

		const dispatch = sinon.stub();
		const state = {
			hasCsrf: false
		};

		actions.CSRFReady({state, dispatch});

		expect(state.hasCsrf).toBeTruthy();
		expect(dispatch.calledOnce).toBeTruthy();
		expect(dispatch.calledWith('Uploads/processQueue')).toBeTruthy();
	});

	it('Doesnt dispatch processQueue on subsequent calls', () => {

		const dispatch = sinon.stub();
		const state = {
			hasCsrf: true
		};

		actions.CSRFReady({state, dispatch});

		expect(state.hasCsrf).toBeTruthy();
		expect(dispatch.calledOnce).toBeFalsy();
	});

	it('Toggles user marker on when its been toggled', async () => {
		const cacheStub = sinon.stub(cache, 'get');
		cacheStub.onFirstCall().returns(true);
		cacheStub.onSecondCall().returns(false);

		const dispatch = sinon.stub();

		await actions.initSettings({dispatch});

		expect(dispatch.calledTwice).toBeTruthy();
		expect(dispatch.firstCall.calledWith('User/init')).toBeTruthy();
		expect(dispatch.secondCall.calledWith('Markers/toggleUserMarker')).toBeTruthy();
	});

	it('doesnt toggle user marker on when its not cached as toggled', async () => {
		sinon.stub(cache, 'get').returns(false);

		const dispatch = sinon.stub();

		await actions.initSettings({dispatch});

		expect(dispatch.calledOnce).toBeTruthy();
	});

	it('Routes to edit when its been cached on edit', async () => {
		const cacheStub = sinon.stub(cache, 'get');
		const routerStub = sinon.stub(router, 'push');
		cacheStub.onFirstCall().returns(false);
		cacheStub.onSecondCall().returns('/edit');

		await actions.initSettings({
			dispatch: sinon.stub()
		});

		expect(routerStub.calledOnce).toBeTruthy();
		expect(routerStub.calledWith('/edit')).toBeTruthy();
	});

	it('Routes to story when its been cached on edit', async () => {
		const cacheStub = sinon.stub(cache, 'get');
		const routerStub = sinon.stub(router, 'push');
		cacheStub.onFirstCall().returns(false);
		cacheStub.onSecondCall().returns('/user/story/1');

		await actions.initSettings({
			dispatch: sinon.stub()
		});

		expect(routerStub.calledOnce).toBeTruthy();
		expect(routerStub.calledWith('/user/story/1')).toBeTruthy();
	});

	it('Doesnt change when no route is cached', async () => {
		const cacheStub = sinon.stub(cache, 'get');
		const routerStub = sinon.stub(router, 'push');
		cacheStub.onFirstCall().returns(false);
		cacheStub.onSecondCall().returns(false);

		await actions.initSettings({
			dispatch: sinon.stub()
		});

		expect(routerStub.called).toBeFalsy();
	});

	it('Doesnt change when already on route', async () => {
		const cacheStub = sinon.stub(cache, 'get');
		const routerStub = sinon.stub(router, 'push');
		cacheStub.onFirstCall().returns(false);
		cacheStub.onSecondCall().returns('/');

		await actions.initSettings({
			dispatch: sinon.stub()
		});

		expect(routerStub.called).toBeFalsy();
	});

});
