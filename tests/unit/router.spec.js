import {describe, it, expect, afterEach} from 'vitest';
import router from '@/router';
import sinon from 'sinon';

describe('router', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('pushes history on pushRoute', () => {
		const historyStub = sinon.stub(history, 'pushState');
		router.pushRoute('test');

		expect(historyStub.calledOnce).toBeTruthy();
		expect(historyStub.calledWith(null, null, `${window.location.protocol}//${window.location.host}/test`)).toBeTruthy();

	});

	it('defines edit route', () => {
		const editRoute = router.options.routes.find((item) => {
			return item.path === '/edit';
		});
		expect(editRoute);
		expect(editRoute.component.name).toBe('EditPage');
	});


	it('defines view route', () => {
		const viewRoute = router.options.routes.find((item) => {
			return item.path === '/:username?/:marker?';
		});
		expect(viewRoute).not.toBeNull();
		expect(viewRoute.component.name).toBe('ViewPage');
	});

	it('defines story route', () => {
		const storyRoute = router.options.routes.find((item) => {
			return item.path === '/:username/story/:story/:marker?';
		});
		expect(storyRoute).not.toBeNull();
		expect(storyRoute.component.name).toBe('StoryPage');
	});
});
