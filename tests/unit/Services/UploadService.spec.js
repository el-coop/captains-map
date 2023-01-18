import sinon from 'sinon';
import {describe, it, expect, afterEach, beforeEach} from 'vitest';
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

	afterEach(() => {
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

		expect(uploadStub.calledTwice).toBeTruthy();
		expect(uploadStub.firstCall.calledWith({uploadTime: 1})).toBeTruthy();
		expect(uploadStub.secondCall.calledWith({uploadTime: 2})).toBeTruthy();
		expect(commitStub.callCount).toBe(4);
		expect(commitStub.firstCall.calledWith('Uploads/markAsWorking', 1)).toBeTruthy();
		expect(commitStub.secondCall.calledWith('Uploads/markAsWorking', null)).toBeTruthy();
		expect(commitStub.thirdCall.calledWith('Uploads/markAsWorking', 2)).toBeTruthy();
		expect(commitStub.getCall(3).calledWith('Uploads/markAsWorking', null)).toBeTruthy();
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

		expect(postStub.calledOnce).toBeTruthy();
		expect(postStub.calledWith('marker/create')).toBeTruthy();
		expect(postStub.firstCall.args[1].get('media[0][type]')).toBe('instagram');
		expect(dispatchStub.calledOnce).toBeTruthy();
		expect(dispatchStub.calledWith("Uploads/uploaded", {
			uploadTime: 1,
			data: 'gata'
		})).toBeTruthy();
	});

	it('Uploads and notifies on success story marker', async () => {
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

		expect(postStub.calledOnce).toBeTruthy();
		expect(postStub.calledWith('marker/create')).toBeTruthy();
		expect(postStub.firstCall.args[1].get('media[0][type]')).toBe('instagram');
		expect(dispatchStub.calledOnce).toBeTruthy();
		expect(dispatchStub.calledWith("Uploads/uploaded", {
			uploadTime: 1,
			data: 'gata'
		})).toBeTruthy();
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

		expect(dispatchStub.calledOnce).toBeTruthy();
		expect(dispatchStub.calledWith("Uploads/uploadError", {
			uploadTime: 1,
			'media[type]': 'instagram',
			error: {
				status: 422,
				data: {
					data: 'gata'
				}
			}
		})).toBeTruthy();
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

		expect(dispatchStub.calledOnce).toBeTruthy();
		expect(dispatchStub.calledWith("Uploads/uploadError", {
			uploadTime: 1,
			media: [{
				type: 'instagram'
			}],
			error: {
				status: 'offline',
				data: {}
			}
		})).toBeTruthy();
	});
});
