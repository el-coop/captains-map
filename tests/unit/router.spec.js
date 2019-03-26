import { assert } from 'chai';
import router from '@/router';
import sinon from 'sinon';

describe('router', () => {

	afterEach(() => {
		sinon.restore();
	});


	it('uses history mode', () => {
		assert.equal(router.mode, 'history');
	});

	it('pushes history on pushRoute', () => {
		const historyStub = sinon.stub(history, 'pushState');
		router.pushRoute('test');

		assert.isTrue(historyStub.calledOnce);
		assert.isTrue(historyStub.calledWith(null, null, `${window.location.protocol}//${window.location.host}/test`));

	});

	it('defines edit route', () => {
		const editRoute = router.options.routes.find((item) => {
			return item.path === '/edit';
		});
		assert.isNotNull(editRoute);
		assert.equal(editRoute.component.name,'edit-layout');
	});


	it('defines view route', () => {
		const viewRoute = router.options.routes.find((item) => {
			return item.path === '/:username?/:marker?';
		});
		assert.isNotNull(viewRoute);
		assert.equal(viewRoute.component.name,'view-layout');
	});
});
