import sinon from 'sinon';
import { assert } from 'chai';
import errorLogger from '@/Services/ErrorLogger';
import http from '@/Services/HttpService';

describe('ErrorLogger.js', () => {

	afterEach('Reset sinon and settings', () => {
		sinon.restore();

	});

	it('logs errors', async () => {

		const httpStub = sinon.stub(http, 'post');

		await errorLogger.handle({
			name: 'name',
			stack: 'stack',
			message: 'stage'
		}, {
			$options: {
				propsData: {
					hata: 'lata'
				}
			},
			_data: {
				rata: 'gata'
			}
		});

		assert.isTrue(httpStub.calledOnce);
		assert.isTrue(httpStub.calledWith('/errors', {
			url: 'http://localhost/',
			userAgent: 'Mozilla/5.0 (win32) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/15.2.1',
			error: {
				name: 'name',
				stack: 'stack',
				message: 'stage'
			},
			vm: {
				props: {
					hata: 'lata'
				},
				data: {
					rata: 'gata'
				}
			}

		}));
	});

});
