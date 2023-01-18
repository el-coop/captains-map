import sinon from 'sinon';
import {describe, it, expect, afterEach} from 'vitest';
import store from '@/store';

import Auth from '@/Middleware/AuthMiddleware';

describe('Authentication Middleware', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('Allows passage for logged in user',async () => {
		sinon.stub(store,'dispatch').returns(true);

		const nextSpy = sinon.spy();

		await Auth.handle({},{}, nextSpy);

		expect(nextSpy.calledOnce).toBeTruthy();
		expect(nextSpy.calledWith()).toBeTruthy();
	});


	it('Sends not logged in user to home',async () => {
		sinon.stub(store,'dispatch').returns(false);

		const nextSpy = sinon.spy();

		await Auth.handle({},{}, nextSpy);

		expect(nextSpy.calledOnce).toBeTruthy();
		expect(nextSpy.calledWith('/')).toBeTruthy();
	});
});
