import sinon from 'sinon';
import { assert } from 'chai';
import uploadService from '@/Services/UploadService';
import Store from '@/store';
import http from '@/Services/HttpService';

describe('UploadService.js', () => {

	let commitStub;
	let dispatchStub;

	beforeEach(() => {
		Store.state.Uploads.queue = [];
		commitStub = sinon.stub(Store, 'commit');
		dispatchStub = sinon.stub(Store, 'dispatch');
	});

	afterEach('Reset sinon and settings', () => {
		sinon.restore();
		// noinspection JSAnnotator
		delete global.localStorage;
	});

	it('Processes queue, updates working marker', async () => {
		Store.state.Uploads.queue = [{uploadTime: 1}, {uploadTime: 2}];

		const uploadStub = sinon.stub(uploadService, 'upload').callsFake(async (key) => {
			Store.state.Uploads.queue.splice(Store.state.Uploads.queue.findIndex((item) => {
				return item.uploadTime === key.uploadTime;
			}), 1);
		});

		await uploadService.processQueue();

		assert.isTrue(uploadStub.calledTwice);
		assert.isTrue(uploadStub.firstCall.calledWith({uploadTime: 1}));
		assert.isTrue(uploadStub.secondCall.calledWith({uploadTime: 2}));
		assert.equal(commitStub.callCount, 4);
		assert.isTrue(commitStub.firstCall.calledWith('Uploads/markAsWorking', 1));
		assert.isTrue(commitStub.secondCall.calledWith('Uploads/markAsWorking', null));
		assert.isTrue(commitStub.thirdCall.calledWith('Uploads/markAsWorking', 2));
		assert.isTrue(commitStub.getCall(3).calledWith('Uploads/markAsWorking', null));
	});

	it('Uploads and notifies on success', async () => {
		const marker = {
			uploadTime: 1,
			media: [{
				type: 'instagram'
			}]
		};

		const postStub = sinon.stub(http, 'post').returns({
			status: 200,
			data: {
				data: 'gata'
			}
		});

		await uploadService.upload(marker);

		assert.isTrue(postStub.calledOnce);
		assert.isTrue(postStub.calledWith('marker/create'));
		assert.equal(postStub.firstCall.args[1].get('media[0][type]'), 'instagram');
		assert.isTrue(dispatchStub.calledOnce);
		assert.isTrue(dispatchStub.calledWith("Uploads/uploaded", {
			uploadTime: 1,
			data: 'gata'
		}));
	});

	it('Dispatches error on fail', async () => {
		const marker = {
			uploadTime: 1,
			'media[type]': 'instagram'
		};

		sinon.stub(http, 'post').returns({
			status: 422,
			data: {
				data: 'gata'
			}
		});

		await uploadService.upload(marker);

		assert.isTrue(dispatchStub.calledOnce);
		assert.isTrue(dispatchStub.calledWith("Uploads/uploadError", {
			uploadTime: 1,
			'media[type]': 'instagram',
			error: {
				status: 422,
				data: {
					data: 'gata'
				}
			}
		}));
	});

	it('Marks as offline error with no response', async () => {
		const marker = {
			uploadTime: 1,
			media: [{
				type: 'instagram'
			}]
		};

		sinon.stub(http, 'post').returns();

		await uploadService.upload(marker);

		assert.isTrue(dispatchStub.calledOnce);
		assert.isTrue(dispatchStub.calledWith("Uploads/uploadError", {
			uploadTime: 1,
			media: [{
				type: 'instagram'
			}],
			error: {
				status: 'offline',
				data: {}
			}
		}));
	});
});
