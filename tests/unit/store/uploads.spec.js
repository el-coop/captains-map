import sinon from 'sinon';
import { assert } from 'chai';
import Store from '@/store';
import uploadsStore from '@/store/uploads';
import cache from '@/Services/Cache';
import uploadService from '@/Services/UploadService';
import auth from '@/Services/AuthenticationService';
import UploadFile from "@/Classes/UploadFile";


describe('Upload store', () => {

	afterEach('Reset sinon and settings', () => {
		sinon.restore();
	});

	it('returns all files', () => {
		uploadsStore.state.queue = [{id: 1}, {id: 2}];
		uploadsStore.state.errored = [{id: 3}, {id: 4}];

		assert.deepEqual(Store.getters['Uploads/allFiles'], [{id: 1}, {id: 2}, {id: 3}, {id: 4}]);
	});

	it('pushes to queue', () => {
		const state = {
			queue: []
		};
		uploadsStore.mutations.pushToQueue(state, {id: 1});

		assert.deepEqual(state.queue[0], {id: 1});
	});


	it('pushes to errored', () => {
		const state = {
			errored: []
		};
		uploadsStore.mutations.pushToErrored(state, {id: 1});

		assert.deepEqual(state.errored[0], {id: 1});
	});


	it('removes from queue', () => {
		const state = {
			queue: [{uploadTime: 1}, {uploadTime: 2}, {uploadTime: 3}]
		};
		uploadsStore.mutations.removeFromQueue(state, 2);

		assert.deepEqual(state.queue, [{uploadTime: 1}, {uploadTime: 3}]);
	});

	it('removes from errored', () => {
		const state = {
			errored: [{uploadTime: 1}, {uploadTime: 2}, {uploadTime: 3}]
		};
		uploadsStore.mutations.removeFromErrored(state, 1);

		assert.deepEqual(state.errored, [{uploadTime: 2}, {uploadTime: 3}]);
	});

	it('marks as working', () => {
		const state = {
			workingId: null
		};
		uploadsStore.mutations.markAsWorking(state, 1);

		assert.deepEqual(state.workingId, 1);
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

		assert.isTrue(uploadServiceStub.notCalled);
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

		assert.isTrue(uploadServiceStub.notCalled);
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

		assert.isTrue(uploadServiceStub.calledOnce);
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

		assert.isTrue(state.loaded);
		assert.isTrue(dispatch.calledOnce);
		assert.isTrue(dispatch.calledWith('processQueue'));
		assert.deepEqual(state.errored, [{
			id: 1,
			error: 'bla',
			media: {
				files: {
					file: new UploadFile('name', 'image'),
					file1: new UploadFile('name1', 'image1'),
				}
			}
		}]);
		assert.deepEqual(state.queue, [{
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

		assert.isTrue(commit.calledOnce);
		assert.isTrue(commit.calledWith('pushToQueue', marker));
		assert.isTrue(cacheStub.calledOnce);
		assert.isTrue(cacheStub.calledWith(marker.uploadTime + '', {value: marker, expiry: null}));
		assert.isTrue(uploadServiceStub.calledOnce);
	});

	it('cancels upload', async () => {
		const commit = sinon.stub();
		const cacheStub = sinon.stub(cache.caches().uploads, 'removeItem');

		await uploadsStore.actions.cancelUpload({commit}, 1);

		assert.isTrue(commit.calledOnce);
		assert.isTrue(commit.calledWith('removeFromErrored', 1));
		assert.isTrue(cacheStub.calledOnce);
		assert.isTrue(cacheStub.calledWith('1'));
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

		assert.isTrue(commit.calledTwice);
		assert.isTrue(commit.calledWith('pushToQueue', marker));
		assert.isTrue(commit.calledWith('removeFromErrored', 1));
		assert.isTrue(uploadServiceStub.calledOnce);
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

		assert.isTrue(commit.calledTwice);
		assert.isTrue(commit.calledWith('pushToQueue', marker));
		assert.isTrue(commit.calledWith('removeFromErrored', 1));
		assert.isFalse(uploadServiceStub.calledOnce);
	});

	it('moves marker from queue to error', async () => {
		const commit = sinon.stub();
		const cacheStub = sinon.stub(cache.caches().uploads, 'setItem');
		uploadsStore.actions._vm = {
			$toast: {
				error: sinon.stub()
			}
		};

		const marker = {
			id: 1,
			uploadTime: 1,
			'media[type]': 'image',
			'media[image]': 'gla'
		};

		await uploadsStore.actions.uploadError({commit}, marker);

		assert.isTrue(commit.calledTwice);
		assert.isTrue(commit.calledWith('pushToErrored', marker));
		assert.isTrue(commit.calledWith('removeFromQueue', 1));
		assert.isTrue(cacheStub.calledOnce);
		assert.isTrue(cacheStub.calledWith('1', {value: marker, expiry: null}));
		assert.isTrue(uploadsStore.actions._vm.$toast.error.calledOnce);
		assert.isTrue(uploadsStore.actions._vm.$toast.error.calledWith('Please try again later', 'Upload failed'));
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

		assert.isTrue(commit.calledTwice);
		assert.isTrue(commit.calledWith('Markers/addAtStart', marker, {
			root: true
		}));
		assert.isTrue(commit.calledWith('removeFromQueue', 1));
		assert.isTrue(cacheStub.calledOnce);
		assert.isTrue(cacheStub.calledWith('1'));
	});

	it('Purges queue', async () => {
		const state = {
			queue: [{id: 1}],
			errored: [{id: 2}],
			workingId: 2,
		};
		const cacheStub = sinon.stub(cache.caches().uploads, 'clear');
		await uploadsStore.actions.purge({state});
		assert.isTrue(cacheStub.calledOnce);
		assert.deepEqual(state, {
			queue: [],
			errored: [],
			workingId: null,
		});
	});

	it('Doesnt retry uploads with offline errors when logged out', () => {
		sinon.stub(auth, 'isLoggedIn').returns(false);

		const state = {
			errored: [{id: 2, status: 'offline'}],
		};
		const dispatch = sinon.stub();

		uploadsStore.actions.uploadOfflineError({state, dispatch});
		assert.isFalse(dispatch.called);
	});

	it('Retries uploads with offline errors when logged in', () => {
		sinon.stub(auth, 'isLoggedIn').returns(true);

		const state = {
			errored: [{id: 2, error: {status: 'offline'}}, {id: 3, error: {status: 'offline'}}],
		};
		const dispatch = sinon.stub();

		uploadsStore.actions.uploadOfflineError({state, dispatch});
		assert.isTrue(dispatch.calledTwice);
		assert.isTrue(dispatch.firstCall.calledWith('returnToQueue', {id: 2, error: {status: 'offline'}}));
		assert.isTrue(dispatch.secondCall.calledWith('returnToQueue', {id: 3, error: {status: 'offline'}}));
	});

	it('Retries only uploads with offline error', () => {
		sinon.stub(auth, 'isLoggedIn').returns(true);

		const state = {
			errored: [{id: 2, error: {status: 'offline'}}, {id: 3, error: {status: '500'}}],
		};
		const dispatch = sinon.stub();

		uploadsStore.actions.uploadOfflineError({state, dispatch});
		assert.isTrue(dispatch.calledOnce);
		assert.isTrue(dispatch.firstCall.calledWith('returnToQueue', {id: 2, error: {status: 'offline'}}));
	});
});
