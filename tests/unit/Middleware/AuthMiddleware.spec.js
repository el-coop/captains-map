import sinon from 'sinon';
import { assert } from 'chai';
import authMiddleware from '@/Middleware/AuthMiddleware';
import store from '@/store';

describe('Authentication Middleware', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Allows passage for logged in user',async () => {
		sinon.stub(store,'dispatch').returns(true);

		const nextSpy = sinon.spy();

		await authMiddleware.handle({},{}, nextSpy);

		assert.isTrue(nextSpy.calledOnce);
		assert.isTrue(nextSpy.calledWith());
	});


	it('Sends not logged in user to home',async () => {
		sinon.stub(store,'dispatch').returns(false);

		const nextSpy = sinon.spy();

		await authMiddleware.handle({},{}, nextSpy);

		assert.isTrue(nextSpy.calledOnce);
		assert.isTrue(nextSpy.calledWith('/'));
	});
});
