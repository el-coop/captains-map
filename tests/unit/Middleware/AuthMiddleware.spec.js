import sinon from 'sinon';
import { assert } from 'chai';
import auth from '@/Services/authentication.service';
import authMiddleware from '@/Middleware/Auth.middleware';

describe('Authentication Middleware', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Allows passage for logged in user',() => {
		sinon.stub(auth,'isLoggedIn').callsFake(() => {
			return true;
		});
		const nextSpy = sinon.spy();

		authMiddleware.handle({},{}, nextSpy);

		assert.isTrue(nextSpy.calledOnce);
		assert.isTrue(nextSpy.calledWith());
	});


	it('Sends not logged in user to home',() => {
		sinon.stub(auth,'isLoggedIn').callsFake(() => {
			return false;
		});
		const nextSpy = sinon.spy();

		authMiddleware.handle({},{}, nextSpy);

		assert.isTrue(nextSpy.calledOnce);
		assert.isTrue(nextSpy.calledWith('/'));
	});
});