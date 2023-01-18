import sinon from 'sinon';
import {describe, it, expect, afterEach} from 'vitest';
import errorLogger from '@/Services/ErrorLogger';
import http from '@/Services/HttpService';

describe('ErrorLogger.js', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('logs errors', async () => {

		const httpStub = sinon.stub();

		http.post = httpStub;

		await errorLogger.handle({
			name: 'name',
			stack: 'stack',
			message: 'stage'
		}, {
			$options: {
				propsData: {
					hata: 'lata'
				},
				_componentTag: 'tag'
			},
		});

		expect(httpStub.calledOnce).toBeTruthy();
		expect(httpStub.calledWith('errors', {
			url: window.location.href,
			userAgent: navigator.userAgent,
			error: {
				name: 'name',
				stack: 'stack',
				message: 'stage'
			},
			vm: {
				props: {
					hata: 'lata'
				},
				tag: 'tag'
			}
		})).toBeTruthy();
	});

});
