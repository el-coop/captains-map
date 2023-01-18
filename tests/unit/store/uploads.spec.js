import sinon from 'sinon';
import {describe, it, expect, afterEach} from 'vitest';
import Store from '@/store';
import uploadsStore from '@/store/uploads';
import cache from '@/Services/Cache';
import uploadService from '@/Services/UploadService';
import UploadFile from "@/Classes/UploadFile";
import toast from "izitoast";


describe('Upload store', () => {

	afterEach(() => {
		sinon.restore();
	});

	it('returns all files', () => {
		uploadsStore.state.queue = [{id: 1}, {id: 2}];
		uploadsStore.state.errored = [{id: 3}, {id: 4}];

		expect(Store.getters['Uploads/allFiles'], [{id: 1}, {id: 2}, {id: 3}, {id: 4}]);
	});

	it('pushes to queue', () => {
		const state = {
			queue: []
		};
		uploadsStore.mutations.pushToQueue(state, {id: 1});

		expect(state.queue[0]).toEqual({id: 1});
	});


	it('pushes to errored', () => {
		const state = {
			errored: []
		};
		uploadsStore.mutations.pushToErrored(state, {id: 1});

		expect(state.errored[0]).toEqual({id: 1});
	});


	it('removes from queue', () => {
		const state = {
			queue: [{uploadTime: 1}, {uploadTime: 2}, {uploadTime: 3}]
		};
		uploadsStore.mutations.removeFromQueue(state, 2);

		expect(state.queue).toEqual([{uploadTime: 1}, {uploadTime: 3}]);
	});

	it('removes from errored', () => {
		const state = {
			errored: [{uploadTime: 1}, {uploadTime: 2}, {uploadTime: 3}]
		};
		uploadsStore.mutations.removeFromErrored(state, 1);

		expect(state.errored).toEqual([{uploadTime: 2}, {uploadTime: 3}]);
	});

	it('marks as working', () => {
		const state = {
			workingId: null
		};
		uploadsStore.mutations.markAsWorking(state, 1);

		expect(state.workingId).toBe(1);
	});

	it('Doesnt process queue when there is no csrf', () => {
		const state = {
			loaded: true
		};
		const rootState = {
			hasCsrf: false
		};

		const uploadServiceStub = sinon.stub(uploadService, 'processQueue');

		uploadsStore.actions.processQueue({state, rootState});

		expect(uploadServiceStub.notCalled).toBeTruthy();
	});

	it('Doesnt process queue when queue isnt loaded', () => {
		const state = {
			loaded: false
		};
		const rootState = {
			hasCsrf: true
		};

		const uploadServiceStub = sinon.stub(uploadService, 'processQueue');

		uploadsStore.actions.processQueue({state, rootState});

		expect(uploadServiceStub.notCalled).toBeTruthy();
	});

	it('processes queue when queue is loaded and csrf is ready', () => {
		const state = {
			loaded: true
		};
		const rootState = {
			hasCsrf: true
		};

		const uploadServiceStub = sinon.stub(uploadService, 'processQueue');

		uploadsStore.actions.processQueue({state, rootState});

		expect(uploadServiceStub.calledOnce).toBeTruthy();
	});

	it('initializes queue', async () => {
		const state = {
			errored: [],
			queue: [],
			loaded: false
		};
		const dispatch = sinon.stub();
		sinon.stub(cache.caches().uploads, 'iterate').callsFake((callback) => {
			callback({
				value: {
					id: 1,
					error: 'bla',
					media: {
						files: {
							file: {
								name: 'name',
								image: 'image'
							},
							file1: {
								name: 'name1',
								image: 'image1'
							}
						}
					}
				}
			});
			callback({
				value: {
					id: 2,
					media: {
						files: {
							file2: {
								name: 'name2',
								image: 'image2'
							}
						}
					}
				}
			});
			callback({
				value: {
					id: 3,
					media: {
						files: {}
					}
				}
			});
		});


		await uploadsStore.actions.init({state, dispatch});

		expect(state.loaded).toBeTruthy();
		expect(dispatch.calledOnce).toBeTruthy();
		expect(dispatch.calledWith('processQueue')).toBeTruthy();
		expect(state.errored).toEqual([{
			id: 1,
			error: 'bla',
			media: {
				files: {
					file: new UploadFile('name', 'image'),
					file1: new UploadFile('name1', 'image1'),
				}
			}
		}]);
		expect(state.queue).toEqual([{
			id: 2,
			media: {
				files: {
					file2: new UploadFile('name2', 'image2'),
				}
			}
		}, {
			id: 3,
			media: {
				files: {}
			}
		}]);
	});

	it('marks marker for upload and process queue', async () => {
		const commit = sinon.stub();
		const cacheStub = sinon.stub(cache.caches().uploads, 'setItem');
		const uploadServiceStub = sinon.stub(uploadService, 'processQueue');

		const marker = {
			id: 1,
			'media[type]': 'instagram',
		};

		await uploadsStore.actions.upload({
			commit
		}, marker);

		expect(commit.calledOnce).toBeTruthy();
		expect(commit.calledWith('pushToQueue', marker)).toBeTruthy();
		expect(cacheStub.calledOnce).toBeTruthy();
		expect(cacheStub.calledWith(marker.uploadTime + '', {value: marker, expiry: null})).toBeTruthy();
		expect(uploadServiceStub.calledOnce).toBeTruthy();
	});

	it('cancels upload', async () => {
		const commit = sinon.stub();
		const cacheStub = sinon.stub(cache.caches().uploads, 'removeItem');

		await uploadsStore.actions.cancelUpload({commit}, 1);

		expect(commit.calledOnce).toBeTruthy();
		expect(commit.calledWith('removeFromErrored', 1)).toBeTruthy();
		expect(cacheStub.calledOnce).toBeTruthy();
		expect(cacheStub.calledWith('1')).toBeTruthy();
	});

	it('returns marker to queue', async () => {
		const commit = sinon.stub();
		const state = {};
		const uploadServiceStub = sinon.stub(uploadService, 'processQueue');

		const marker = {
			id: 1,
			uploadTime: 1,
			'media[type]': 'instagram'
		};

		await uploadsStore.actions.returnToQueue({
			state, commit, rootState: {
				hasCsrf: true
			}
		}, marker);

		expect(commit.calledTwice).toBeTruthy();
		expect(commit.calledWith('pushToQueue', marker)).toBeTruthy();
		expect(commit.calledWith('removeFromErrored', 1)).toBeTruthy();
		expect(uploadServiceStub.calledOnce).toBeTruthy();
	});

	it('returns marker to queue but doesnt process when no csrf', async () => {
		const commit = sinon.stub();
		const state = {};
		const uploadServiceStub = sinon.stub(uploadService, 'processQueue');

		const marker = {
			id: 1,
			uploadTime: 1,
			'media[type]': 'instagram'
		};

		await uploadsStore.actions.returnToQueue({
			state, commit, rootState: {
				hasCsrf: false
			}
		}, marker);

		expect(commit.calledTwice).toBeTruthy();
		expect(commit.calledWith('pushToQueue', marker)).toBeTruthy();
		expect(commit.calledWith('removeFromErrored', 1)).toBeTruthy();
		expect(uploadServiceStub.calledOnce).toBeFalsy();
	});

	it('moves marker from queue to error', async () => {
		const commit = sinon.stub();
		const cacheStub = sinon.stub(cache.caches().uploads, 'setItem');
		const toastStub = sinon.stub(toast, 'error');


		const marker = {
			id: 1,
			uploadTime: 1,
			'media[type]': 'image',
			'media[image]': 'gla'
		};

		await uploadsStore.actions.uploadError({commit}, marker);

		expect(commit.calledTwice).toBeTruthy();
		expect(commit.calledWith('pushToErrored', marker)).toBeTruthy();
		expect(commit.calledWith('removeFromQueue', 1)).toBeTruthy();
		expect(cacheStub.calledOnce).toBeTruthy();
		expect(cacheStub.calledWith('1', {value: marker, expiry: null})).toBeTruthy();
		expect(toastStub.calledOnce).toBeTruthy();
		expect(toastStub.calledWith({message: 'Please try again later', title: 'Upload failed'})).toBeTruthy();
	});

	it('removes marker from storage when uploaded', async () => {
		const commit = sinon.stub();
		const cacheStub = sinon.stub(cache.caches().uploads, 'removeItem');
		const marker = {
			id: 1,
			uploadTime: 1,
			'media[type]': 'image',
			'media[image]': 'gla'
		};

		await uploadsStore.actions.uploaded({commit}, marker);

		expect(commit.calledTwice).toBeTruthy();
		expect(commit.calledWith('Markers/addAtStart', marker, {
			root: true
		})).toBeTruthy();
		expect(commit.calledWith('removeFromQueue', 1)).toBeTruthy();
		expect(cacheStub.calledOnce).toBeTruthy();
		expect(cacheStub.calledWith('1')).toBeTruthy();
	});

	it('removes marker from storage when uploaded and adds to story if story id', async () => {
		const commit = sinon.stub();
		const cacheStub = sinon.stub(cache.caches().uploads, 'removeItem');
		const marker = {
			id: 1,
			uploadTime: 1,
			story_id: 1,
			'media[type]': 'image',
			'media[image]': 'gla'
		};

		await uploadsStore.actions.uploaded({commit}, marker);

		expect(commit.calledTwice).toBeTruthy();
		expect(commit.calledWith('Stories/add', marker, {
			root: true
		})).toBeTruthy();
		expect(commit.calledWith('removeFromQueue', 1)).toBeTruthy();
		expect(cacheStub.calledOnce).toBeTruthy();
		expect(cacheStub.calledWith('1')).toBeTruthy();
	});

	it('Purges queue', async () => {
		const state = {
			queue: [{id: 1}],
			errored: [{id: 2}],
			workingId: 2,
		};
		const cacheStub = sinon.stub(cache.caches().uploads, 'clear');
		await uploadsStore.actions.purge({state});
		expect(cacheStub.calledOnce).toBeTruthy();
		expect(state).toEqual({
			queue: [],
			errored: [],
			workingId: null,
		});
	});

	it('Doesnt retry uploads with offline errors when logged out',async () => {

		const state = {
			errored: [{id: 2, status: 'offline'}],
		};
		const dispatch = sinon.stub();
		dispatch.onCall(0).returns(false);

		await uploadsStore.actions.uploadOfflineError({state, dispatch});
		expect(dispatch.calledOnce).toBeTruthy();
	});

	it('Retries uploads with offline errors when logged in', async () => {

		const state = {
			errored: [{id: 2, error: {status: 'offline'}}, {id: 3, error: {status: 'offline'}}],
		};
		const dispatch = sinon.stub();
		dispatch.onCall(0).returns(true);

		await uploadsStore.actions.uploadOfflineError({state, dispatch});
		expect(dispatch.calledThrice).toBeTruthy();
		expect(dispatch.secondCall.calledWith('returnToQueue', {id: 2, error: {status: 'offline'}})).toBeTruthy();
		expect(dispatch.thirdCall.calledWith('returnToQueue', {id: 3, error: {status: 'offline'}})).toBeTruthy();
	});

	it('Retries only uploads with offline error', async () => {

		const state = {
			errored: [{id: 2, error: {status: 'offline'}}, {id: 3, error: {status: '500'}}],
		};
		const dispatch = sinon.stub();

		dispatch.onCall(0).returns(true);

		await uploadsStore.actions.uploadOfflineError({state, dispatch});
		expect(dispatch.calledTwice).toBeTruthy();
		expect(dispatch.secondCall.calledWith('returnToQueue', {id: 2, error: {status: 'offline'}})).toBeTruthy();
	});
});
