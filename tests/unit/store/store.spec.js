import sinon from 'sinon';
import { assert } from 'chai';
import { actions } from '@/store';

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
});
